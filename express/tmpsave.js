async function getAllChildNodes(startNodeId, callback) {
    try{
        var tree = [];//descandents? 
        var nodesToLoad = [];
        var curnode = await Node.findOne({_id: startNodeId });
        console.log('curnode-----', curnode.id)
        tree.push(curnode);
        nodesToLoad =  await Node.find({ parent: startNodeId});//node.children;
        console.log('nodesToLoad: ',nodesToLoad.length)
        let count = 0;
        
        async.whilst(
            () => {
              console.log('-----',count < nodesToLoad.length, '=======')
              return count < nodesToLoad.length;
            },
            (callback) => {
                console.log('==========88888============')
                var subnode = nodesToLoad[count]
                tree.push(subnode);
                console.log('subnode id', subnode._id)
                var children = [];
                Node.find({ parent: subnode._id}).exec((err, children)=>{
                  nodesToLoad = nodesToLoad.concat(children);
                  count += 1;
                  callback();
                }); 
            },//cb
            (err) => {
              if (err) {
                console.error(err);
                return callback(err);
              }
              return callback(null, tree);
            }
        );   }//try
    catch(e){
        console.log('err happend when get Manager list', e);
    }
}