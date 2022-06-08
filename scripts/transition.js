// 当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完全加载。
// document.addEventListener('DOMContentLoaded', speechToEmotion, false)

// 重新開始遊戲
function again() {
    $("#main").css('display', 'block');
    $("#introduction_chinese").css('display', 'none');
    $("#introduction_english").css('display', 'none');
    $("#introduction_portuguese").css('display', 'none');
    $("#pin_code").css('display', 'none');
    $("#emotion_recognition").css('display', 'none');
    $("#emotion_recognition_result").css('display', 'none');
    $("#end_card").css('display', 'none');

    clearInterval(window.languageCarTimer) // 清除語言頁面倒計時
    clearInterval(window.endCarTimer) // 清除結束頁面倒計時
}

// 選擇語言
function language_game(number) {
    chinese = document.getElementById('introduction_chinese')
    english = document.getElementById('introduction_english')
    portuguese = document.getElementById('introduction_portuguese')
    switch (parseInt(number)) {
        case 1:
            chinese.style.display = 'block'
            english.style.display = 'none'
            portuguese.style.display = 'none'
            break;
        case 2:
            chinese.style.display = 'none'
            english.style.display = 'block'
            portuguese.style.display = 'none'
            break;
        case 3:
            chinese.style.display = 'none'
            english.style.display = 'none'
            portuguese.style.display = 'block'
            break;
    }

    // 語言頁面倒計時
    window.languageCarNum = 60
    $('.introduction_start').text(`開始（${window.languageCarNum}）`)
    window.languageCarTimer = setInterval(() => {
        window.languageCarNum -= 1
        $('.introduction_start').text(`開始（${window.languageCarNum}）`)
        if (window.languageCarNum <= 0) {
            again()
        }
    }, 1000)
}

function language_start() {
    $("#pin_code").css("display", "block")
    clearInterval(window.languageCarTimer) //清除語言頁面倒計時
}

function pin_code_start() {
    $("#emotion_recognition").css("display", "block")

    // 倒計時 
    window.emotionRecognitionNum = 10
    $('#emotion_recognition_title').text(`情緒識別（${window.emotionRecognitionNum}）`)
    window.emotionRecognitionTimer = setInterval(() => {
        window.emotionRecognitionNum -= 1
        $('#emotion_recognition_title').text(`情緒識別（${window.emotionRecognitionNum}）`)
        if (window.emotionRecognitionNum <= 0) {
            clearInterval(window.emotionRecognitionTimer) // 清除倒計時
            emotion_recognition_next()
        }
    }, 1000)
}

function emotion_recognition_next() {
    $("#emotion_recognition_result").css("display", "block")

    // 倒計時 
    window.emotionRecognitionResultnNum = 10
    $('#emotion_recognition_result_titile').text(`情緒結果（${window.emotionRecognitionResultnNum}）`)
    window.emotionRecognitionResultnNumTimer = setInterval(() => {
        window.emotionRecognitionResultnNum -= 1
        $('#emotion_recognition_result_titile').text(`情緒結果（${window.emotionRecognitionResultnNum}）`)
        if (window.emotionRecognitionResultnNum <= 0) {
            clearInterval(window.emotionRecognitionResultnNumTimer) // 清除倒計時
            emotion_recognition_result_next()
        }
    }, 1000)
}


// 進入到結束頁面
function emotion_recognition_result_next() {
    $("#end_card").css("display", "block")
    // 結束頁面倒計時
    window.endCarNum = 10
    $('#endButton').text(`再來！（${window.endCarNum}）`)
    window.endCarTimer = setInterval(() => {
        window.endCarNum -= 1
        $('#endButton').text(`再來！（${window.endCarNum}）`)
        if (window.endCarNum <= 0) {
            again()
        }
    }, 1000)
}

function speechToEmotion() {

    const recognition = new webkitSpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = true

    recognition.onresult = function (event) {

        const results = event.results
        const transcript = results[results.length - 1][0].transcript

        setEmoji('searching')

        fetch(`/emotion?text=${transcript}`)
            .then((response) => response.json())
            .then((result) => {
                console.log("結果:", result)
                if (result.score > 0) {
                    setEmoji('positive')
                } else if (result.score < 0) {
                    setEmoji('negative')
                } else {
                    setEmoji('neutral')
                }
            })
            .catch((e) => {
                console.error('Request error -> ', e)
                recognition.abort()
            })
    }

    recognition.onerror = function (event) {
        console.error('Recognition error -> ', event.error)
        setEmoji('error')
    }

    recognition.onaudiostart = function () {
        setEmoji('listening')
    }

    recognition.onend = function () {
        setEmoji('idle')
    }

    recognition.start();

    function setEmoji(type) {
        const emojiElem = document.querySelector('.emoji img')
        emojiElem.classList = type
    }
}


