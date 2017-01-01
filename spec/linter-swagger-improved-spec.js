'use babel';

import { join } from 'path';
import { provideLinter } from '../lib/index';

const lint = provideLinter().lint;

const YAML_INTEGE = join( __dirname, 'fixtures', 'petstore-bad.yaml' );

describe( 'The Swagger provider for Linter', () => {
  describe( 'linting YAML files', () => {
    beforeEach( () => {
      atom.workspace.destroyActivePaneItem();
      waitsForPromise( () => {
        return Promise.all( [
          atom.packages.activatePackage( 'linter-swagger' ),
          atom.packages.activatePackage( 'language-yaml' )
        ] );
      }
      );
    } );


    fdescribe( 'tony\'s custom test', () => {
      return it( 'finds all the messages', () => {
        return waitsForPromise( () => {
          return atom.workspace.open( YAML_INTEGE ).then( ( editor ) => {
            return lint( editor ).then( ( messages ) => {
              expect( messages.length ).toEqual( 2 );
              const msg = messages[ 0 ];
              expect( msg.type ).toBe( 'Error' );
              expect( msg.text ).toBe( 'No enum match for: intege' );
              expect( msg.filePath ).toBe( YAML_INTEGE );
              expect( msg.range ).toEqual( [ [ 39, 8 ], [ 39, 12 ] ] );
            } );
          }
          );
        }
        );
      }
      );
    }
    );
  } );
} );
