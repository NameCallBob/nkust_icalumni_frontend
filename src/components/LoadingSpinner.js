import React, { useState, useEffect } from 'react';

const EnhancedLoadingSpinner = ({ initialMessage = "正在載入中..." }) => {
    // 設定狀態來追蹤等待時間和顯示訊息
    const [waitTime, setWaitTime] = useState(0);
    const [message, setMessage] = useState(initialMessage);
    const [dots, setDots] = useState('');

    // 安撫訊息列表，隨著等待時間變化
    const comfortMessages = [
        "正在載入中...",
        "資料處理中，請稍候...",
        "我們正在準備您的內容...",
        "快好了，再等一下下...",
        "感謝您的耐心等待...",
        "系統正在努力為您處理...",
        "我們正在盡快完成...",
        "您的請求非常重要，正在處理中...",
        "馬上就好了，謝謝您的耐心...",
        "再堅持一下，馬上完成..."
    ];

    // 更新等待時間和訊息
    useEffect(() => {
        const waitTimer = setInterval(() => {
            setWaitTime(prevTime => prevTime + 1);

            // 每10秒更換一次安撫訊息
            if (waitTime % 10 === 0 && waitTime > 0) {
                const messageIndex = Math.min(Math.floor(waitTime / 10), comfortMessages.length - 1);
                setMessage(comfortMessages[messageIndex]);
            }
        }, 1000);

        return () => clearInterval(waitTimer);
    }, [waitTime]);

    // 創建動畫點點效果
    useEffect(() => {
        const dotsTimer = setInterval(() => {
            setDots(prev => {
                if (prev.length >= 3) return '';
                return prev + '.';
            });
        }, 500);

        return () => clearInterval(dotsTimer);
    }, []);

    // 計算進度條百分比 (模擬進度，實際使用時可能需要根據實際進度調整)
    const progressPercentage = Math.min(waitTime * 3, 90);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md text-center px-4">
                {/* 自訂動畫元素 */}
                <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-b-purple-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                    </div>
                </div>

                {/* 安撫訊息 */}
                <div className="mt-8">
                    <h4 className="text-xl font-semibold text-gray-800">{message}{dots}</h4>
                    <p className="text-gray-600 mt-2">已等待 {waitTime} 秒</p>
                </div>

                {/* 進度條 */}
                <div className="mt-6 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                        style={{width: `${progressPercentage}%`}}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedLoadingSpinner;