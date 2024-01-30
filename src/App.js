import { useState } from "react";

function App() {
  // 初期化関数: 指定したサイズと初期値で二次元配列を生成
  const initArray = (size, type) => {
    return Array.from({ length: size }, () =>
      Array.from({ length: size }).fill(type)
    );
  };

  // lightButtonsArray ステートの初期化
  const [lightButtonsArray, setLightButtonsArray] = useState(
    initArray(5, true)
  );

  // answerArray ステートの初期化
  const [answerArray, setAnswerArray] = useState(initArray(5, false));

  const [tapNum, setTapNum] = useState(0);

  // lightButtonsArray と answerArray ステートを更新する関数
  const updateArrays = (size, type) => {
    setLightButtonsArray(initArray(size, type));
    setAnswerArray(initArray(size, false));
    setTapNum(0);
  };

  // ボタンをクリックして lightButtonsArray を縮小する関数
  const clickShrinkButton = () => {
    const size = lightButtonsArray.length;
    if (size === 2) return;
    updateArrays(size - 1, true);
  };

  // ボタンをクリックして lightButtonsArray を拡大する関数
  const clickEnlargeButton = () => {
    const size = lightButtonsArray.length;
    if (size === 10) return;
    updateArrays(size + 1, true);
  };

  // リセットボタンをクリックして lightButtonsArray をリセットする関数
  const clickResetButton = () => {
    updateArrays(5, true);
  };

  // 問題ボタンをクリックしてランダムなパターンの lightButtonsArray を生成する関数
  const clickQuestionButton = () => {
    const size = lightButtonsArray.length;
    let newArray = [];
    for (let i = 0; i < size; i++) {
      let rowArray = [];
      for (let j = 0; j < size; j++) {
        var random = Math.floor(Math.random() * 2);
        rowArray.push(random === 0 ? true : false);
      }
      newArray.push(rowArray);
    }
    setLightButtonsArray(newArray);
    setAnswerArray(initArray(size, false));
    setTapNum(0);
  };

  // 回答ボタンをクリックしてライツアウトの問題を解く関数
  // 0行目以降は上の段が消えるようにボタンを教えていくアルゴリズム
  const clickSolveButtonFast = () => {
    const size = lightButtonsArray.length;
    const linearLimit = 1 << size;
    const allOffButtons = initArray(size, false);

    // 0行目のみを走査する
    for (let linear = 0; linear < linearLimit; linear++) {
      let nowLightButtonsArray = copyMatrix(lightButtonsArray);
      let newAnswerArray = initArray(size, false);
      let tempLinear = linear;

      // 0行目のボタンを押した状態を生成.0行目の列を走査
      for (let j = 0; j < size; j++) {
        if (tempLinear % 2 === 1) {
          nowLightButtonsArray = getUpdateLightButtons(
            0,
            j,
            nowLightButtonsArray
          );
          newAnswerArray[0][j] = true;
        }
        tempLinear >>= 1;
      }

      // 0行目から走査して、true状態の下のボタンを押したArrayを作る
      for (let i = 0; i < size - 1; i++) {
        for (let j = 0; j < size; j++) {
          if (nowLightButtonsArray[i][j] === true) {
            nowLightButtonsArray = getUpdateLightButtons(
              i + 1,
              j,
              nowLightButtonsArray
            );
            newAnswerArray[i + 1][j] = true;
          }
        }
      }

      if (isMatchArray(allOffButtons, nowLightButtonsArray)) {
        setAnswerArray(newAnswerArray);
        return;
      }
    }

    alert("答えがありません。問題を作り直してください。");
  };

  function copyMatrix(base) {
    const result = [];
    for (const line of base) {
      result.push([...line]);
    }
    return result;
  }

  // 回答ボタンをクリックしてライツアウトの問題を解く関数
  const clickSolveButton = () => {
    const size = lightButtonsArray.length;
    const linearLimit = 1 << (size * size);

    for (let linear = 0; linear < linearLimit; linear++) {
      let allOffButtons = initArray(size, false);
      let tempLinear = linear;

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (tempLinear % 2 === 1) {
            allOffButtons = getUpdateLightButtons(i, j, allOffButtons);
          }
          tempLinear >>= 1;
        }
      }

      if (isMatchArray(lightButtonsArray, allOffButtons)) {
        let tempLinear = linear;
        const newAnswerArray = initArray(size, false);

        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            if (tempLinear % 2 === 1) {
              newAnswerArray[i][j] = true;
            }
            tempLinear >>= 1;
          }
        }

        setAnswerArray(newAnswerArray);

        return;
      }
    }

    alert("答えがありません。問題を作り直してください。");
  };

  // 二次元配列が一致しているか判定する関数
  const isMatchArray = (array1, array2) => {
    for (let i = 0; i < array1.length; i++) {
      for (let j = 0; j < array1.length; j++) {
        if (array1[i][j] !== array2[i][j]) return false;
      }
    }
    return true;
  };

  // ボタンをクリックしてライトボタンの状態を更新する関数
  const getUpdateLightButtons = (row, column, Array) => {
    let newLightbuttonsArray = [...Array];
    const buttonLength = lightButtonsArray.length;
    // 押したボタンの反転
    newLightbuttonsArray[row][column] = !newLightbuttonsArray[row][column];
    // 押したボタンの上下のボタンの反転
    row > 0 &&
      (newLightbuttonsArray[row - 1][column] =
        !newLightbuttonsArray[row - 1][column]);
    row < buttonLength - 1 &&
      (newLightbuttonsArray[row + 1][column] =
        !newLightbuttonsArray[row + 1][column]);
    // 押したボタンの左右のボタンの反転
    column > 0 &&
      (newLightbuttonsArray[row][column - 1] =
        !newLightbuttonsArray[row][column - 1]);
    column < buttonLength - 1 &&
      (newLightbuttonsArray[row][column + 1] =
        !newLightbuttonsArray[row][column + 1]);

    return newLightbuttonsArray;
  };

  const isLitghsOut = () => {
    return !lightButtonsArray.flat(1).reduce((pre, current) => {
      return pre || current;
    });
  };

  // ライトボタンをクリックしたときの処理
  const clickLigthButton = (row, column) => {
    let newLightbuttonsArray = [...lightButtonsArray];

    newLightbuttonsArray = getUpdateLightButtons(
      row,
      column,
      newLightbuttonsArray
    );
    // 結果反映
    setLightButtonsArray(newLightbuttonsArray);
    setTapNum(tapNum + 1);
  };

  // JSX を返す部分
  return (
    <div className="App">
      <h1 className="title">ライツアウト</h1>
      <div className="buttons">
        <button className="shrinkButton" onClick={clickShrinkButton}>
          -
        </button>
        <button className="enlargeButton" onClick={clickEnlargeButton}>
          +
        </button>
        <button className="resetButton" onClick={clickResetButton}>
          リセット
        </button>
        <button className="questionButton" onClick={clickQuestionButton}>
          問題
        </button>
        <button className="solveButton" onClick={clickSolveButtonFast}>
          回答
        </button>
      </div>
      <div>{`問題サイズ ${lightButtonsArray.length}  タップ数 ${tapNum}`}</div>
      <div className="lightButtonsArea">
        {lightButtonsArray.map((elements, outerIndex) => (
          <div key={outerIndex} className="row">
            {elements.map((column, innerIndex) => {
              return (
                <div
                  key={`${outerIndex}-${innerIndex}`}
                  className={`lightButton ${column ? "" : "off"}`}
                  onClick={() => clickLigthButton(outerIndex, innerIndex)}
                >
                  <div>
                    {isLitghsOut()
                      ? "おめでと"
                      : answerArray[outerIndex][innerIndex] === true
                      ? "ここ"
                      : ""}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
