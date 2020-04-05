import SpriteSheet from 'mmbuz';
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
        this.style({
            %e: '100%',
            position: 'absolute',
            top: 0,
            left: 0
        });
   } 
}
