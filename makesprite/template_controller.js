import SpriteSheet from 'bbcore/sprite-sheet';
import JSON from './instructions.json';
%a

export default class %b extends SpriteSheet {
    constructor(){
        super();
        this.json = JSON;
        this.json.images = %c;
        this.init();
    }

    init(){
        super.init();
        this.dom.id = '%d';
        this.style('%e','100%');
   } 
}
