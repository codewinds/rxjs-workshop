# Bookmark Notes

A simple web app built with [feature-u] using React.js, redux,
[redux-util], and [redux-logic].

It is built to showcase how feature-u helps with feature-based development.

Features are self-contained directories in the `src/features` folder. They are accumulated in the `src/features/index.js` file.

## Usage

```bash
npm install
npm start
```

## Resources

 - [feature-u docs](https://feature-u.js.org/) - comprehensive documentation for feature-u
 - [feature-u repo](https://github.com/kevinast/feature-u) - source for feature-u
 - [feature-redux](https://github.com/kevinast/feature-redux) - redux aspect plugin for feature-u. Extends feature-u with redux state management.
 - [feature-redux-logic](https://github.com/kevinast/feature-redux-logic) - redux-logic aspect plugin for feature-u. Extends feature-u with redux-logic for managing business logic and performing async processing.

[feature-u]: https://feature-u.js.org
[redux-logic]: https://github.com/jeffbski/redux-logic
[redux-util]: https://github.com/jeffbski/redux-util
