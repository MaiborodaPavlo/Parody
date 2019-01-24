/* global HTMLElement Proxy */
import "babel-polyfill"

export class Parody{
    constructor(props){
        if(typeof props !== "object"){
            props = {};
        }

        this.props = props;
        this.isMount = false;
        this.targetNode;
    }

    initState(obj) {
        this.state = watchObj(obj, this.render.bind(this));
    }

    bindMount(selector){
        this.isMount = true;
        this.targetNode = document.querySelector(selector);
        return this;
    }

    render(node){
        if(this.isMount){
            this.targetNode.innerHTML = '';
            this.targetNode.appendChild(node);
        }

        return node;
    }
}

export function ParodyDom(tag, props, ...children){

    if(typeof tag === "function"){
        return (new tag(props)).render();
    }

    let node = document.createElement(tag);

    let addChildren = (child) => {
        if (child instanceof HTMLElement) {
            node.appendChild(child);
        }
        else if (typeof child === 'object'){
            for (let elem of child){
                addChildren(elem);
            }
        }
        else {
            let textNode = document.createTextNode(child);
            node.appendChild(textNode);
        }
    }

    children.forEach(addChildren);

    Object.assign(node, props);

    return node;
}

function watchObj(el, func){

    return new Proxy(el, {

        set(target, name, value){
            target[name] = value;
            func();
            return true;
        },

        get(target, name){

            switch (typeof target[name]) {
                case 'object':
                    return watchObj(target[name], func);
                case 'function':
                    return target[name].bind(target);
                default:
                    return target[name];
            }
        }
    });
};