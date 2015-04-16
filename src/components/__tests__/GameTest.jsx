jest.dontMock('../Game');

describe ('Game', () => {
  it('has the correct text', () => {
    var React = require('react/addons');
    var TestUtils = React.addons.TestUtils;
    var Game = require('../Game');

    var game = TestUtils.renderIntoDocument(
      <Game />
    );

    var text = React.findDOMNode(game).innerHTML;
    
    expect(text).toEqual("This is my a game");
  });
});