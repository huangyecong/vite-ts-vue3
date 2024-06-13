// 自定义一个Pinia插件：给所有仓库添加一条全局属性

export default function createPiniaPlugin(): any {
  console.log('Pinia plugins demo test~~~~~~~~')
  return {
    secret:'the cake is a lie'
  }
}