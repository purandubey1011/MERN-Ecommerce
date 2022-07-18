module.exports=(theFunc)=> (req,res,Next) =>{
    Promise.resolve(theFunc(req,res,Next)).catch(Next)
}