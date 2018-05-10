import DomElement from 'bbcore/dom-element';
import IMG from './img.%a';

export default class %b extends DomElement {
    constructor(){
        super();
        this.dom = null;
    }

    init(){
        this.dom = document.createElement('IMG');
        this.dom.id = '%c';
        this.dom.setAttribute('src', IMG);
        this.style('%d', '100%');
        this.appendTo();
    }
}
