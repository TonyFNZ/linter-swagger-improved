> **Update: March 20th 2017** <br/>
> The improved error handler from within this project has now been merged into the main [linter-swagger][linter-swagger] project.  This project will be kept here for reference, but I recommend everyone switch to using the [linter-swagger][linter-swagger] project where this functionality will be maintained from now on.

# linter-swagger-improved
[![apm](https://img.shields.io/apm/v/linter-swagger-improved.svg)](https://atom.io/packages/linter-swagger-improved) [![apm](https://img.shields.io/apm/dm/linter-swagger-improved.svg)](https://atom.io/packages/linter-swagger-improved)

An improved version of the [linter-swagger][linter-swagger] plugin with better identification of errors within your swagger files.

This plugin for [Linter][linter] will lint [Swagger 2.0 specifications][swagger], both JSON and YAML using [`swagger-parser` node package][swagger-parser].

## Linting Examples
Debugging Swagger spec errors has always been a frustrating experience, with the error messages given seemingly random and arbitrary.  Here are a few examples of how this plugin improves things.

### Invalid Types
```yaml
swagger: "2.0"
info:
  title: "Sample 1"
  version: "1.0.0"
paths:
  /todos:
    get:
      description: "Returns all todo items"
      responses:
        200:
          description: "A list of todo items"
          schema:
            type: array
            items:
              type: object
              properties:
                id:
                  type: strin
                  format: uuid
                name:
                  type: string
```
| Now | ![Sample 1 Errors After][1-after] |
---|---
| Before | ![Sample 1 Errors Before][1-before] |


### Invalid Properties
```yaml
swagger: "2.0"
info:
  title: "Sample 2"
  version: "1.0.0"
paths:
  /todos:
    get:
      description: "Returns all todo items"
      responses:
        200:
          description: "A list of todo items"
          schema:
            type: array
            items:
              type: object
              properties:
                id:
                  type: string
                  forma: uuid
                name:
                  type: string
```
| Now | ![Sample 2 Errors After][2-after] |
---|---
| Before | ![Sample 2 Errors Before][2-before] |



## Installation

Install `linter-swagger-improved` either in Atom's Preferences/Install Packages, or with
`apm` on the command-line:

```sh
apm install linter-swagger-improved
```

This package will automatically install `linter` if that is missing.

## License

MIT. More info in the [LICENSE file](./LICENSE.md)

[linter]: https://github.com/AtomLinter/Linter "Linter Atom Package"
[linter-swagger]: https://github.com/AtomLinter/linter-swagger "Linter-Swagger Atom Package"
[swagger]: http://swagger.io/ "Swagger Main Site"
[swagger-parser]: https://www.npmjs.com/package/swagger-parser "Swagger Parser NPM Page"
[1-before]: https://github.com/TonyFNZ/linter-swagger-improved/raw/master/docs/1-before.png "Sample 1 Errors Before"
[1-after]: https://github.com/TonyFNZ/linter-swagger-improved/raw/master/docs/1-after.png "Sample 1 Errors After"
[2-before]: https://github.com/TonyFNZ/linter-swagger-improved/raw/master/docs/2-before.png "Sample 2 Errors Before"
[2-after]: https://github.com/TonyFNZ/linter-swagger-improved/raw/master/docs/2-after.png "Sample 2 Errors After"
