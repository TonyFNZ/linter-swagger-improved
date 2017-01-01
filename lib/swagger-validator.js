'use babel';

import SwaggerParser from 'swagger-parser';
import { rangeFromLineNumber } from 'atom-linter';

function tokenizedLineForRow( editor, lineNumber ) {
  return editor.tokenizedBuffer.tokenizedLineForRow( lineNumber );
}

function checkTokenScope( scopes ) {
  return scopes.includes( 'entity.name.tag.yaml' ) ||
    scopes.includes( 'meta.structure.dictionary.json' );
}

function extractRange( givenPath, editor ) {
  let lineNumber = 0;
  let pathIndex = 0;
  let foundRange;
  const maxLine = editor.getLineCount();
  // remove numeric indexes
  const path = givenPath.filter( ( str ) => { return isNaN( str ); } );

  const checkLineTokens = ( tokens ) => {
    let offset = 0;
    tokens.forEach( ( token ) => {
      if ( checkTokenScope( token.scopes ) &&
          token.value === path[ pathIndex ] ) {
        pathIndex += 1;
        if ( pathIndex >= path.length ) {
          foundRange = [ [ lineNumber, offset ], [ lineNumber, offset + token.value.length ] ];
          return;
        }
      }
      offset += token.value.length;
    } );
  };

  while ( lineNumber <= maxLine ) {
    const tokenizedLine = tokenizedLineForRow( editor, lineNumber );
    if ( typeof tokenizedLine === 'undefined' ) {
      break;
    }
    checkLineTokens( tokenizedLine.tokens );
    if ( foundRange ) {
      return foundRange;
    }
    lineNumber += 1;
  }

  // Unable to determine the range for some reason
  return null;
}

function findCauseErrors( input, causes = [] ) {
  for ( let i = 0; i < input.length; i += 1 ) {
    const error = input[ i ];
    if ( error.inner ) {
      findCauseErrors( error.inner, causes );
    } else {
      error.fullPath = error.path.concat( error.params );
      causes.push( error );
    }
  }
  return causes;
}

function isSubsetPath( subset, path ) {
  if ( subset.length >= path.length ) {
    return false;
  }

  for ( let i = 0; i < subset.length; i += 1 ) {
    if ( subset[ i ] !== path[ i ] ) {
      return false;
    }
  }

  return true;
}

function removeSecondaryErrors( input ) {
  const output = [];

  for ( let i = 0; i < input.length; i += 1 ) {
    const error = input[ i ];
    let isSecondary = false;

    for ( let j = 0; j < input.length; j += 1 ) {
      const other = input[ j ];

      if ( isSubsetPath( error.fullPath, other.fullPath ) ) {
        isSecondary = true;
        break;
      }
    }

    if ( !isSecondary ) {
      output.push( error );
    }
  }

  return output;
}


function canValidate( path, text ) {
  return text.length > 8 &&
    /"?swagger"?\s*:\s*['"]\d+\.\d+['"]/g.test( text );
}

function errorsToLinterMessages( err, path, editor ) {
  const errObj = err.toJSON();
  if ( !errObj.details ) {
    return [ {
      type: 'Error',
      text: errObj.message,
      filePath: path,
      range: rangeFromLineNumber( editor )
    } ];
  }

  let errors = errObj.details;
  errors = findCauseErrors( errors );
  errors = removeSecondaryErrors( errors );

  return errors.map( ( error ) => {
    return ( {
      type: 'Error',
      text: error.message,
      filePath: path,
      range: extractRange( error.path, editor )
    } );
  } );
}

export default async function tryValidate( editor ) {
  const path = editor.getPath();
  const text = editor.getText();
  if ( !canValidate( path, text ) ) {
    return [];
  }

  try {
    await SwaggerParser.validate( path, { validate: { spec: true } } );
    return [];
  } catch ( err ) {
    // if (editor.getText() !== text) {
    //  // Editor contents have changed, tell Linter not to update messages
    //  return null;
    // }

    const linterMessages = errorsToLinterMessages( err, path, editor );
    return linterMessages;
  }
}
