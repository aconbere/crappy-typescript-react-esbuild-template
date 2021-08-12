default: run

run: build-electron install
    cp ./public/index.html ./build/index.html
    DEV=true npx node esbuild-app.js & npx electron ./build/bundle/electron/electron.js

build-electron:
    npx tsc -b tsconfig-electron.json
    npx node esbuild-electron.js

build-app:
    npx tsc -b tsconfig-app.json
    npx node esbuild-app.js

build: install build-electron build-app

# Install dependencies
install:
    npx npm install

# Run tests
test: lint
    npx jest src/

# Check the linting
lint:
    npx prettier --check src/**/*.js 

# Generates the package directory
package:
    npx electron-builder --dir

# Package in a distributable format dmg, msi, deb, etc.
distribute: install clean build-electron build-app test
    npx electron-builder --publish=never

# Delete built files
clean:
    rm -rf ./build/*

watch-ts:
    npx tsc -w
