

const recursiveTraverse = (node,action)=>{
    if(!node || !node.children) {return};//如果为空直接返回
    action(node.value);//传入进每一个节点要干事情的函数
    node.children.forEach(function(item,index){
        recursiveTraverse(item,action)
    })

}

// 递归实现
recursiveTraverse(tree, console.log);




// 广度优先
function treeBreadthFirst (tree, func) {
    let node, list = [...tree]
    //shift数组的第一个元素
    while (node = list.shift()) {
      func(node)
      node.children && list.push(...node.children)
    }
  }

  //维护一个队列



  //利用先序遍历  树结构转列表结构

  function treeTolist (tree, result= [],level= 0) {
      tree.forEach(node =>{

          result.push(node);

          node.level = level +1 ;

          node.children && treeTolist(node.children,result,level +1 );
      })
      return result;
  }