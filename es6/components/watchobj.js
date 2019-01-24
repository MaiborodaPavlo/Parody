
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

export default watchObj;