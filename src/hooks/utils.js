
//本文件提供各种函数方法。
//问题：path的结构应该提供什么

//深拷贝
export const deepClone = x => JSON.parse(JSON.stringify(x));

//找节点 
export const findTargetNode = (root, path) => {

    let curNode = root;
    //对path进行遍历
    for (const idx of path) {
        //将curNode.children的值赋值给children，样子应该像children:[]
        const { children } = curNode;
        if (idx >= children.length || idx < 0) {
            throw new Error('找不到节点，请给出正确的路径');
        }

        curNode = children[idx];
    }
    return curNode;
}


export const findMaxId = rootNode => {
    const { children } = rootNode;
    const curId = rootNode._id;

    return children
        ? Math.max(...[curId, ...children.map(findMaxId)])
        : curId;
}

//得到一个新的带有根节点排序的新树
export const initStateWithUniqIds = rootNode => {
    let curId = 0;
    //对树形结构每一层都进行排序
    const _addId = node => {
        node._id = curId;
        curId += 1;

        const {children} = node ;
        if (children){
            for (const child of children){
                _addId(child);
            }
        }

        return node;
    }


    return _addId(deepClone(rootNode))
}


//设置节点状态
const setStatusDown = (node, status) => {

    node.checked = status;

    const{ children} = node ;

    if (children){
        for (const child of children){
            setStatusDown(child, status);
        }
    }
    return {...node};
}


export const setAllCheckedStatus = setStatusDown;

export const getNewCheckedStatus = node => {
    const { children } = node ;

    //没有孩子就已经检查过了
    if(!children?.length >0 ) return node.checked

    let sum = 0 ;

    for (const c of children) {
        sum += c.checked;
    }


    let newCheckedStatus = 0.5;
    if (sum === children.length){
        newCheckedStatus = 1;
    }else if (sum ===0) {
        newCheckedStatus = 0;
    }

    return newCheckedStatus;
}


export const updateStatusUp = nodes => {
    if(nodes.length === 0) return ;


    const curNode = nodes.pop();
    curNode.checked =getNewCheckedStatus(curNode);

    updateStatusUp(nodes);
}


export const checkNode = (rootNode,path,status) => {
    let curNode = rootNode;
    const parentNode = [curNode];

    for (const index of path ){
        curNode = curNode.children[index];
        parentNode.push(curNode);
    }


    setStatusDown(curNode,status);


    parentNode.pop();
    updateStatusUp(parentNode);

    return {...rootNode}
}



export const renameNode = (rootNode,path,newName) => {
    const targetNode = findTargetNode(rootNode,path);
    targetNode.name = newName;

    return {...rootNode};
    
}




export const deleteNode = (rootNode,path ) =>{
    let curNode = rootNode;
    if (path.length === 0){

        curNode.children = [];
        curNode.checked = 0;

        return curNode;
    }

    const parentNodes = [curNode];
    const lastIdx = path.pop();

    for (const index of path){
        curNode = curNode.children[index];
        parentNodes.push(curNode);
    }
 
}



