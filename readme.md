# Link Router

A utility to route links to various browsers.

## Why?

For work, I often have to use different browsers to test on. I got tired of copying the url to the specific browser I needed.

I'm lazy.

## Usage

```
npm install
node index.js
```

For best results, `index.js` should be run at startup.

## How does it work?

This works in two parts

1. Web Server
  - The main program hosts a web server. This is what actually routes urls to the desired destinations.
2. Chrome Extension
  - The extension is what provides the context menu in your browser, in order to communicate with the web server

## API

By default, the server runs on port 9102. The base url is `http://localhost:9102`

### `/routes`

Retrieves the name of all available routes, and returns as an array.

### `/routes/:name?url=url`

Passes the provided `url` to the route with the given `:name`.

## Configuration

```json
{
    "port": 9102, // you probably shouldn't change this, 'cuz the extension isn't configurable yet*!
    "command": "open -na %s \"%s\"", // the command to run. the first %s is substituted with the route, the second is substituted with the url
    "routes": {
        "name": "value" // the name of the route and the value to substitute into the command
    }
}

// * and probably never will be :pensive:
```

