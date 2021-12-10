const fs = require('fs');

// \n 用来换行  正则替换( 边界情况可能不准确 )
function strReplace(code) {
    let newStr
    newStr = code.replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '')      //js单行
    newStr = newStr.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '\n')   // js多行    
    newStr = newStr.replace(/<!--[\s\S]*?-->/, '')     // html

    // 下边这行是匹配与代码在一行的注释, 可能会把 带有 ‘//’ 的全干掉，例如连接: https://www.yuque.com
    newStr = newStr.replace(/(?<!\:)\/\/[^\n]*/g, '')
    return newStr
}

// 检测是否是目录
function isDir(path) {
    let stat = fs.lstatSync(path)
    return stat.isDirectory()
}
// 这个函数是核心代码，核心思想是递归，递归终止的条件是判断当前的是文件还是文件夹
function handle(sourcePath, targetPath) {
    let dirArr = fs.readdirSync(sourcePath)
    // 如果存在 删除旧的 否则创建新的
    if (fs.existsSync(targetPath)) fs.rmdirSync(targetPath)
    else fs.mkdirSync(targetPath)

    for (const key in dirArr) {
        // 如果是目录 递归
        if (isDir(sourcePath + '/' + dirArr[key])) {
            handle(sourcePath + '/' + dirArr[key], targetPath + '/' + dirArr[key])
        // 否则如果是文件
        } else {
            let file = fs.readFileSync(sourcePath + '/' + dirArr[key], 'utf-8')
            fs.writeFileSync(targetPath + '/' + dirArr[key], strReplace(file))
        }
    }
}

handle('./src', './newsrc')
