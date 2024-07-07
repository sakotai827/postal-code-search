let postalData = null;
let branchData = null;

Promise.all([
    fetch('postal_codes.json').then(response => response.json()),
    fetch('branch_codes.json').then(response => response.json())
]).then(([postalCodes, branchCodes]) => {
    postalData = postalCodes;
    branchData = branchCodes;
    console.log('郵便番号データを読み込みました:', postalData);
    console.log('支社コードデータを読み込みました:', branchData);
}).catch(error => console.error('データの読み込みに失敗しました:', error));

function formatPostalCode(code) {
    return code.slice(0, 3) + '-' + code.slice(3);
}

function searchPostalCode(searchWord) {
    let results = {};
    searchWord = searchWord.replace('-', '');
    for (let prefecture in postalData) {
        let matching = postalData[prefecture].filter(item => 
            item.address.includes(searchWord) || item.postal_code.replace('-', '').includes(searchWord)
        );
        if (matching.length > 0) {
            results[prefecture] = matching;
        }
    }
    return results;
}

document.getElementById('search-button').addEventListener('click', function() {
    var searchWord = document.getElementById('search-input').value;
    var results = searchPostalCode(searchWord);
    displayResults(results);
});

function displayResults(data) {
    var resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    if (Object.keys(data).length > 0) {
        for (let prefecture in data) {
            let prefectureButton = document.createElement('button');
            prefectureButton.className = 'prefecture-button';
            prefectureButton.textContent = prefecture + ' (' + data[prefecture].length + '件)';
            
            let prefectureContent = document.createElement('div');
            prefectureContent.className = 'prefecture-content';
            
            data[prefecture].forEach(function(item) {
                let div = document.createElement('div');
                div.className = 'result-item';
                div.textContent = formatPostalCode(item.postal_code) + ' ' + item.address;
                div.addEventListener('click', function() {
                    handleResultClick(item.postal_code);
                });
                prefectureContent.appendChild(div);
            });
            
            resultsDiv.appendChild(prefectureButton);
            resultsDiv.appendChild(prefectureContent);
            
            prefectureButton.addEventListener("click", function() {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            });
        }
    } else {
        resultsDiv.textContent = '該当する住所が見つかりませんでした。';
    }
}

function handleResultClick(postalCode) {
    var formattedCode = formatPostalCode(postalCode);
    document.getElementById('selected-postal-code').textContent = formattedCode;
    document.getElementById('copy-button').style.display = 'inline-block';
    
    console.log('検索する郵便番号:', formattedCode);
    console.log('branchDataの内容:', branchData);
    
    if (branchData[formattedCode]) {
        console.log('一致する支社データが見つかりました:', branchData[formattedCode]);
        document.getElementById('branch-code').querySelector('span').textContent = branchData[formattedCode].branchCode;
        document.getElementById('branch-name').querySelector('span').textContent = branchData[formattedCode].branchName;
    } else {
        console.log('一致する支社データが見つかりませんでした');
        document.getElementById('branch-code').querySelector('span').textContent = '該当なし';
        document.getElementById('branch-name').querySelector('span').textContent = '該当なし';
    }
    
    document.getElementById('selected-postal-code').scrollIntoView({behavior: 'smooth'});
}

document.getElementById('copy-button').addEventListener('click', function() {
    var postalCode = document.getElementById('selected-postal-code').textContent;
    navigator.clipboard.writeText(postalCode).then(function() {
        alert('郵便番号をコピーしました: ' + postalCode);
    }, function(err) {
        console.error('コピーに失敗しました: ', err);
    });
});

document.getElementById('admin-login-button').addEventListener('click', function() {
    window.location.href = 'login.html';
});

window.onscroll = function() {
    var scrollToTopBtn = document.getElementById("scroll-to-top");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

document.getElementById("scroll-to-top").onclick = function() {
    window.scrollTo({top: 0, behavior: 'smooth'});
};
