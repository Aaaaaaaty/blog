'use strict';
var queens = function (boarderSize) {
  // 用递归生成一个start到end的Array
  var interval = function (start, end) {
    if (start > end) { return []; }
    return interval(start, end - 1).concat(end);
  };
  // 检查一个组合是否有效
  var isValid = function (queenCol) {
    // 检查两个位置是否有冲突
    var isSafe = function (pointA, pointB) {
      var slope = (pointA.row - pointB.row) / (pointA.col - pointB.col);
      if ((0 === slope) || (1 === slope) || (-1 === slope)) { return false; }
      return true;
    };
    var len = queenCol.length;
    var pointToCompare = {
      row: queenCol[len - 1],
      col: len
    };
    // 先slice出除了最后一列的数组，然后依次测试每列的点和待测点是否有冲突，最后合并测试结果
    return queenCol
      .slice(0, len - 1)
      .map(function (row, index) {
        return isSafe({row: row, col: index + 1}, pointToCompare);
      })
      .reduce(function (a, b) {
        return a && b;
      });
  };
  // 递归地去一列一列生成符合规则的组合
  var queenCols = function (size) {
    if (1 === size) {
      return interval(1, boarderSize).map(function (i) { return [i]; });
    }
    // 先把之前所有符合规则的列组成的集合再扩展一列，然后用reduce降维，最后用isValid过滤掉不符合规则的组合
    return queenCols(size - 1)
      .map(function (queenCol) {
        return interval(1, boarderSize).map(function (row) {
          return queenCol.concat(row);
        });
      })
      .reduce(function (a, b) {
        return a.concat(b);
      })
      .filter(isValid);
  };
  // queens函数入口
  return queenCols(boarderSize);
};

console.log(queens(8));