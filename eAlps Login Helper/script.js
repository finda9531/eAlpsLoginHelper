// content.js

// 1. ログを出す
console.log('Loaded!');

chrome.storage.sync.get(['matrixChars'], (result) => {
    console.log(' Settings loaded', result);

    const chars = result.matrixChars;

    // 設定チェック
    if (!chars || chars.length !== 4 || chars.some(c => c === "")) {
        console.log(': Error - 設定が空です。アイコンから設定してください。');
        return;
    }

    // 文字 -> ファイル名変換関数
    function convertCharToFilename(char) {
        if (!char) return null;
        const upperChar = char.toUpperCase();
        const charCode = upperChar.charCodeAt(0);
        if (charCode >= 65 && charCode <= 90) {
            const num = charCode - 64;
            return `i${num}.gif`;
        }
        return null;
    }

    const targetSequence = chars.map(c => convertCharToFilename(c));
    console.log(' Extension: Clicking Sequence ->', targetSequence);

    // 2. ページ読み込み完了から少し待つ時間を「1秒」に延ばす（読み込み遅れ対策）
    setTimeout(() => {
        const allImageButtons = document.querySelectorAll('div.input_imgdiv_class');
        console.log(` Extension: Found ${allImageButtons.length} buttons on page.`);

        if (allImageButtons.length === 0) {
            console.error(' Extension: Error - 画像ボタンが見つかりません。セレクタが合っていないか、まだ表示されていません。');
            return;
        }

        const findButtonByImageName = (imageName) => {
            for (const button of allImageButtons) {
                // style属性の確認
                const bgImage = button.style.backgroundImage;
                if (bgImage && bgImage.includes(imageName)) {
                    return button;
                }
            }
            return null;
        };

        let clickCount = 0;

        targetSequence.forEach((imageName, index) => {
            const targetButton = findButtonByImageName(imageName);
            if (targetButton) {
                targetButton.click();
                clickCount++;
                console.log(`Step ${index + 1}: Clicked ${imageName}`);
            } else {
                console.error(`Step ${index + 1}: Could not find image for ${imageName} (${chars[index]})`);
            }
        });

        if (clickCount === 4) {
            console.log('★ All clicked. Attempting login...');
            setTimeout(() => {
                const loginButton = document.getElementById('btnLogin');
                if (loginButton) {
                    loginButton.click();
                } else {
                    console.error('Login button not found');
                }
            }, 500);
        }

    }, 650); // 待ち時間を1000ms(1秒)に変更
});