import React from 'react'
import { fetchArticles } from '../actions'
import ReactMDL from '../../node_modules/react-mdl/out/ReactMDL.js';
// var Textfield = ReactMDL.Textfield;
// var Textfield = '/client/node_modules/react-mdl/lib/Textfield.js'
console.log('reactMDL',ReactMDL);
// var Spinner = ReactMDL.Spinner;
export var Search = ({store}) => {
  let input;
  //TODO: refactor into separate components?
  return (
    <div>

      <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__header-row">
          <a href="#" className="logo-link">
            <span className="mdl-layout-title">
              <div className="logo"><i className="material-icons logo-icon">public</i></div>
              Worldwide news
            </span>
          </a>
          <div className="mdl-layout-spacer"></div>
            <div className="search-box">
              <div className="search-icon"><i className="material-icons">search</i></div>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
               
                <input
                  className="mdl-textfield__input"
                  type="text"
                  id="search-input"
                  ref={node => {
                    input = node;
                  }}
                  onChange={
                    _.debounce((() =>
                      store.dispatch(
                        fetchArticles(
                          store.getState().articleFilter,
                          input.value
                      ))),
                      300
                    )
                  }

                />

              </div>
            </div>
          <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
            <i className="material-icons">more_vert</i>
          </button>
          <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
            <li className="mdl-menu__item">About</li>
            <li className="mdl-menu__item">Contact</li>
            <li className="mdl-menu__item">Legal information</li>
          </ul>
        </div>
      </header>
    </div>
  );
}
