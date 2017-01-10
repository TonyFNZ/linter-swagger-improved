'use babel';

import { join } from 'path';
import { provideLinter } from '../lib/index';

const lint = provideLinter().lint;


describe( 'Linting JSON files', () => {
  beforeEach( () => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise( () => {
      return Promise.all( [
        atom.packages.activatePackage( 'linter-swagger' ),
        atom.packages.activatePackage( 'language-json' )
      ] );
    }
      );
  } );


  it( 'Handles correct input with no errors', () => {
    const PETSTORE = join( __dirname, 'data', 'petstore.json' );

    waitsForPromise( () => {
      return atom.workspace.open( PETSTORE ).then( ( editor ) => {
        lint( editor ).then( ( messages ) => {
          expect( messages.length ).toEqual( 0 );
        } );
      } );
    } );
  } );


  it( 'Handles invalid type errors', () => {
    const SAMPLE1 = join( __dirname, 'data', 'sample1.json' );

    waitsForPromise( () => {
      return atom.workspace.open( SAMPLE1 ).then( ( editor ) => {
        lint( editor ).then( ( messages ) => {
          expect( messages.length ).toEqual( 2 );

          expect( messages[ 0 ] ).toEqual( {
            type: 'Error',
            text: 'No enum match for: strin',
            filePath: SAMPLE1,
            range: [ [ 19, 40 ], [ 19, 46 ] ]
          } );

          expect( messages[ 1 ] ).toEqual( {
            type: 'Error',
            text: 'Expected type array but found type string',
            filePath: SAMPLE1,
            range: [ [ 19, 40 ], [ 19, 46 ] ]
          } );
        } );
      } );
    } );
  } );


  it( 'Handles additional property errors', () => {
    const SAMPLE2 = join( __dirname, 'data', 'sample2.json' );

    waitsForPromise( () => {
      return atom.workspace.open( SAMPLE2 ).then( ( editor ) => {
        lint( editor ).then( ( messages ) => {
          expect( messages.length ).toEqual( 1 );

          expect( messages[ 0 ] ).toEqual( {
            type: 'Error',
            text: 'Additional properties not allowed: forma',
            filePath: SAMPLE2,
            range: [ [ 20, 40 ], [ 20, 47 ] ]
          } );
        } );
      } );
    } );
  } );


  it( 'Rejects unsupported \'anyOf\' directive', () => {
    const SAMPLE3 = join( __dirname, 'data', 'sample3.json' );

    waitsForPromise( () => {
      return atom.workspace.open( SAMPLE3 ).then( ( editor ) => {
        lint( editor ).then( ( messages ) => {
          expect( messages.length ).toEqual( 2 );

          expect( messages[ 0 ] ).toEqual( {
            type: 'Error',
            text: 'Additional properties not allowed: anyOf',
            filePath: SAMPLE3,
            range: [ [ 13, 28 ], [ 13, 35 ] ]
          } );

          expect( messages[ 1 ] ).toEqual( {
            type: 'Error',
            text: 'Missing required property: type',
            filePath: SAMPLE3,
            range: [ [ 13, 28 ], [ 13, 35 ] ]
          } );
        } );
      } );
    } );
  } );


  it( 'Handles bad reference errors', () => {
    const SAMPLE4 = join( __dirname, 'data', 'sample4.json' );

    waitsForPromise( () => {
      return atom.workspace.open( SAMPLE4 ).then( ( editor ) => {
        lint( editor ).then( ( messages ) => {
          expect( messages.length ).toEqual( 1 );

          expect( messages[ 0 ] ).toEqual( {
            type: 'Error',
            text: `Error resolving $ref pointer "${SAMPLE4}#/definitions/INVALIDREFERENCE". \nToken "definitions" does not exist.`,
            filePath: SAMPLE4,
            range: undefined
          } );
        } );
      } );
    } );
  } );

  it( 'Handles errors within an array', () => {
    const SAMPLE5 = join( __dirname, 'data', 'sample5.json' );

    waitsForPromise( () => {
      return atom.workspace.open( SAMPLE5 ).then( ( editor ) => {
        lint( editor ).then( ( messages ) => {
          expect( messages.length ).toEqual( 1 );

          expect( messages[ 0 ] ).toEqual( {
            type: 'Error',
            text: 'Additional properties not allowed: descriptio',
            filePath: SAMPLE5,
            range: [ [ 13, 6 ], [ 13, 18 ] ]
          } );
        } );
      } );
    } );
  } );


  it( 'Handles nested properties with the same name', () => {
    const SAMPLE6 = join( __dirname, 'data', 'sample6.json' );

    waitsForPromise( () => {
      return atom.workspace.open( SAMPLE6 ).then( ( editor ) => {
        lint( editor ).then( ( messages ) => {
          expect( messages.length ).toEqual( 2 );

          expect( messages[ 0 ] ).toEqual( {
            type: 'Error',
            text: 'No enum match for: strin',
            filePath: SAMPLE6,
            range: [ [ 19, 20 ], [ 19, 26 ] ]
          } );
        } );
      } );
    } );
  } );
} );
