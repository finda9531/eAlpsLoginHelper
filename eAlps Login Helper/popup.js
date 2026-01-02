document.addEventListener('DOMContentLoaded', () => {
    // 保存された設定（文字）を読み込む
    chrome.storage.sync.get(['matrixChars'], (result) => {
        if (result.matrixChars) {
            document.getElementById('char1').value = result.matrixChars[0] || '';
            document.getElementById('char2').value = result.matrixChars[1] || '';
            document.getElementById('char3').value = result.matrixChars[2] || '';
            document.getElementById('char4').value = result.matrixChars[3] || '';
        }
    });

    // 設定を保存する
    document.getElementById('saveBtn').addEventListener('click', () => {
        // 入力値を大文字にして取得
        const chars = [
            document.getElementById('char1').value.trim().toUpperCase(),
            document.getElementById('char2').value.trim().toUpperCase(),
            document.getElementById('char3').value.trim().toUpperCase(),
            document.getElementById('char4').value.trim().toUpperCase()
        ];

        chrome.storage.sync.set({ matrixChars: chars }, () => {
            const status = document.getElementById('status');
            status.textContent = 'Settings Saved Successfully!';
            setTimeout(() => {
                status.textContent = '';
            }, 2000);
        });
    });
});