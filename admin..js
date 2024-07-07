// セキュリティチェック
if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = 'login.html';
}

let branchData = JSON.parse(localStorage.getItem('branchData')) || {};

function saveBranchData() {
    localStorage.setItem('branchData', JSON.stringify(branchData));
}

document.getElementById('add-button').addEventListener('click', function() {
    const postalCode = document.getElementById('postal-code').value.replace('-', '');
    const branchCode = document.getElementById('branch-code').value;
    const branchName = document.getElementById('branch-name').value;

    if (postalCode && branchCode && branchName) {
        branchData[postalCode] = { branchCode, branchName };
        saveBranchData();
        alert('データを追加しました。');
        clearInputs();
    } else {
        alert('全てのフィールドを入力してください。');
    }
});

document.getElementById('update-button').addEventListener('click', function() {
    const postalCode = document.getElementById('postal-code').value.replace('-', '');
    const branchCode = document.getElementById('branch-code').value;
    const branchName = document.getElementById('branch-name').value;

    if (postalCode && branchCode && branchName) {
        if (branchData[postalCode]) {
            branchData[postalCode] = { branchCode, branchName };
            saveBranchData();
            alert('データを更新しました。');
            clearInputs();
        } else {
            alert('指定された郵便番号のデータが見つかりません。');
        }
    } else {
        alert('全てのフィールドを入力してください。');
    }
});

document.getElementById('delete-button').addEventListener('click', function() {
    const postalCode = document.getElementById('postal-code').value.replace('-', '');

    if (postalCode) {
        if (branchData[postalCode]) {
            delete branchData[postalCode];
            saveBranchData();
            alert('データを削除しました。');
            clearInputs();
        } else {
            alert('指定された郵便番号のデータが見つかりません。');
        }
    } else {
        alert('郵便番号を入力してください。');
    }
});

document.getElementById('logout-button').addEventListener('click', function() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
});

function clearInputs() {
    document.getElementById('postal-code').value = '';
    document.getElementById('branch-code').value = '';
    document.getElementById('branch-name').value = '';
}
