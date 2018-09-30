module.exports = {
  mode: "production",

  entry: {
    SwipeCounter: "./lib/SwipeCounter.js",
    SwipeMarkdown: "./lib/SwipeMarkdown.js",
    SwipePage: "./lib/SwipePage.js",
    SwipeScreen: "./lib/SwipeScreen.js",
    SwipeBook: "./lib/SwipeBook.js",
    SwipeElement: "./lib/SwipeElement.js",
    SwipeMediaPlayer: "./lib/SwipeMediaPlayer.js",
    SwipeParser: "./lib/SwipeParser.js",
    SwipeTouch: "./lib/SwipeTouch.js",
    SwipeUtil: "./lib/SwipeUtil.js",
  },

  output: {
    filename: "[name].js",
    library: "[name]",
    libraryTarget: "umd"
  }
}
