let isRunning = true;

function getVideoStats() {
    try {
        // 先尝试获取普通UP主
        let uploaderElement = document.querySelector('.up-name');
        // 如果没有找到普通UP主，则尝试获取共创作者
        if (!uploaderElement) {
            uploaderElement = document.querySelector('.staff-name');
        }
        
        const stats = {
            playCount: document.querySelector('.view-text')?.textContent || '未知',
            likeCount: document.querySelector('.video-like-info.video-toolbar-item-text')?.textContent || '未知',
            coinCount: document.querySelector('.video-coin-info.video-toolbar-item-text')?.textContent || '未知',
            favoriteCount: document.querySelector('.video-fav-info.video-toolbar-item-text')?.textContent || '未知',
            shareCount: document.querySelector('.video-share-info.video-toolbar-item-text')?.textContent || '未知',
            title: document.querySelector('.video-title.special-text-indent')?.textContent || '未知视频',
            // 修改UP主信息的获取逻辑
            uploader: uploaderElement?.textContent || '未知UP主',
            danmakuCount: document.querySelector('.dm-text')?.textContent || '未知',
            publishDate: document.querySelector('.pubdate-ip-text')?.textContent || '未知'
        };

        stats.title = stats.title.trim();
        stats.uploader = stats.uploader.trim();

        return stats;
    } catch (error) {
        console.error('获取视频数据失败:', error);
        return null;
    }
}

function createStatsTable() {
    // 如果已经存在表格，就不要重新创建
    if (document.getElementById('bilibili-stats-table')) {
        return;
    }

    const stats = getVideoStats();
    if (!stats) return;

    const table = document.createElement('div');
    table.id = 'bilibili-stats-table';
    
    // 添加拖动功能所需的样式
    table.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 242, 245, 0.85));
        padding: 25px;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        z-index: 9999;
        font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        min-width: 380px;
        max-width: 420px;
        user-select: text !important;
        transition: all 0.5s ease-in-out;
    `;

    // 添加拖动功能
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // 鼠标按下事件
    table.addEventListener('mousedown', dragStart);

    // 鼠标移动事件
    document.addEventListener('mousemove', drag);

    // 鼠标释放事件
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        // 如果点击的是关闭按钮，不启动拖动
        if (e.target.id === 'close-stats-table') return;
        
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === table) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, table);
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }

    // 添加半透明背景遮罩
    const overlay = document.createElement('div');
    overlay.id = 'stats-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
        z-index: 9998;
    `;

    table.innerHTML = `
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid rgba(0, 161, 214, 0.1);
        ">
            <h3 style="
                margin: 0;
                background: linear-gradient(120deg, #00a1d6, #00b5e5, #00d1ff);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                font-size: 22px;
                font-weight: 600;
                letter-spacing: 1px;
                text-shadow: 0 2px 4px rgba(0, 161, 214, 0.1);
            ">当前视频数据一览</h3>
            <button id="close-stats-table" style="
                position: absolute;
                right: -10px;
                top: -10px;
                border: none;
                background: rgba(255, 255, 255, 0.95);
                cursor: pointer;
                color: #00a1d6;
                font-size: 18px;
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
            ">×</button>
        </div>
        <div style="
            margin-bottom: 20px;
            font-size: 14px;
            color: #2c3e50;
            background: rgba(255, 255, 255, 0.7);
            padding: 15px;
            border-radius: 16px;
            border: 1px solid rgba(0, 161, 214, 0.1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
            user-select: text !important;
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            pointer-events: auto !important;
        ">
            <div style="margin-bottom: 10px; font-weight: 500; color: #1a1a1a;">
                <span style="color: #00a1d6; margin-right: 8px;">▎</span>
                <span style="color: #666; margin-right: 8px;">标题：</span>${stats.title}
            </div>
            <div style="color: #00a1d6; font-weight: 500;">
                <span style="color: #00a1d6; margin-right: 8px;">▎</span>
                <span style="color: #666; margin-right: 8px;">UP：</span>${stats.uploader}
            </div>
        </div>
        <div style="
            background: rgba(255, 255, 255, 0.7);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            user-select: text !important;
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            pointer-events: auto !important;
        ">
            ${Object.entries({
                '发布时间': stats.publishDate,
                '播放量': stats.playCount,
                '弹幕数': stats.danmakuCount,
                '点赞数': stats.likeCount,
                '投币数': stats.coinCount,
                '收藏数': stats.favoriteCount,
                '分享数': stats.shareCount
            }).map(([key, value], index) => `
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: 15px 20px;
                    border-bottom: ${index !== 6 ? '1px solid rgba(0, 161, 214, 0.1)' : 'none'};
                    background: ${index % 2 === 0 ? 'rgba(248, 249, 250, 0.5)' : 'transparent'};
                    transition: background 0.3s ease;
                    min-height: 24px;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    white-space: normal;
                ">
                    <span style="
                        color: #666;
                        font-weight: 500;
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                    ">
                        <span style="
                            display: inline-block;
                            width: 5px;
                            height: 5px;
                            background: #00a1d6;
                            border-radius: 50%;
                            margin-right: 10px;
                            flex-shrink: 0;
                        "></span>
                        ${key}
                    </span>
                    <span style="
                        color: #00a1d6;
                        font-weight: 500;
                        font-size: 14px;
                        text-align: right;
                        margin-left: 15px;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                        white-space: normal;
                    ">${value}</span>
                </div>
            `).join('')}
        </div>
        <div style="
            margin-top: 15px;
            padding: 8px;
            background: rgba(248, 249, 250, 0.7);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        ">
            <span id="countdown" style="
                color: #666;
                font-size: 14px;
                letter-spacing: 0.5px;
            ">5秒后自动关闭</span>
            <div style="display: flex; align-items: center;">
                <span style="
                    color: #00a1d6;
                    font-weight: 500;
                    margin-right: 4px;
                    font-size: 16px;
                ">By</span>
                <span style="
                    background: linear-gradient(120deg, #00a1d6, #00b5e5, #00d1ff);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-weight: 600;
                    font-size: 16px;
                ">法师</span>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(table);

    // 先设置关闭按钮的事件监听
    const closeButton = table.querySelector('#close-stats-table');
    
    // 修改关闭函数
    const closeTable = () => {
        // 修改滑动动画和位置
        table.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            transform: none;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 242, 245, 0.85));
            padding: 25px;
            border-radius: 0 0 0 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            z-index: 9999;
            font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            min-width: 380px;
            max-width: 420px;
            user-select: text !important;
            transition: all 0.5s ease-in-out;
        `;
        
        // 清除倒计时文字
        const countdownElement = table.querySelector('#countdown');
        if (countdownElement) {
            countdownElement.textContent = '';
        }
        
        // 移除遮罩
        overlay.remove();
        isRunning = false;
        
        // 重新绑定关闭按钮事件
        const closeButton = table.querySelector('#close-stats-table');
        if (closeButton) {
            closeButton.onclick = () => {
                table.remove();
                // 恢复视频播放功能
                const videoPlayer = document.querySelector('.bpx-player-video-wrap video');
                const videoContainer = document.querySelector('.bpx-player');
                if (videoPlayer && videoContainer) {
                    videoContainer.style.pointerEvents = 'auto';
                    videoPlayer.removeEventListener('play', preventPlay, true);
                    videoPlayer.removeEventListener('playing', preventPlay, true);
                    videoPlayer.removeEventListener('click', preventPlay, true);
                    document.removeEventListener('keydown', preventKeyControl, true);
                }
            };
        }
        
        // 获取视频播放器和播放按钮
        const videoPlayer = document.querySelector('.bpx-player-video-wrap video');
        const videoContainer = document.querySelector('.bpx-player');
        
        if (videoPlayer && videoContainer) {
            // 暂停视频
            videoPlayer.pause();
            
            // 禁用整个视频容器的点击事件
            videoContainer.style.pointerEvents = 'none';
            
            // 添加事件监听器阻止视频播放
            const preventPlay = (e) => {
                e.preventDefault();
                e.stopPropagation();
                videoPlayer.pause();
            };
            
            // 阻止所有可能的播放触发方式
            videoPlayer.addEventListener('play', preventPlay, true);
            videoPlayer.addEventListener('playing', preventPlay, true);
            videoPlayer.addEventListener('click', preventPlay, true);
            
            // 阻止键盘控制
            const preventKeyControl = (e) => {
                if (e.code === 'Space' || e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
                    e.preventDefault();
                    e.stopPropagation();
                }
            };
            
            document.addEventListener('keydown', preventKeyControl, true);
        }
    };

    // 修改倒计时功能
    let countdown = 5;
    const countdownElement = table.querySelector('#countdown');
    
    const updateCountdown = () => {
        if (countdown > 0) {
            countdownElement.textContent = `${countdown}秒后自动关闭`;
            countdown--;
            setTimeout(updateCountdown, 1000);
        }
    };
    
    updateCountdown();

    // 5秒后自动关闭并播放视频
    setTimeout(closeTable, 5000);

    // 点击关闭按钮时改为滑动到右上角
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            // 立即清除倒计时文字
            const countdownElement = table.querySelector('#countdown');
            if (countdownElement) {
                countdownElement.textContent = '';
            }
            // 停止倒计时更新
            countdown = 0;
            clearTimeout(updateCountdown);
            clearTimeout(closeTable);
            closeTable();
        });
    }

    // 点击遮罩时改为滑动到右上角
    overlay.addEventListener('click', () => {
        // 立即清除倒计时文字
        const countdownElement = table.querySelector('#countdown');
        if (countdownElement) {
            countdownElement.textContent = '';
        }
        // 停止倒计时更新
        countdown = 0;
        clearTimeout(updateCountdown);
        clearTimeout(closeTable);
        closeTable();
    });
}

function init() {
    isRunning = true;
    
    function update() {
        if (!isRunning) return;
        
        const isLoaded = document.querySelector('#viewbox_report') || 
                        document.querySelector('.video-info-detail-list') ||
                        document.querySelector('.ops');
                             
        if (!isLoaded) {
            requestAnimationFrame(update);
            return;
        }

        // 获取现有表格
        const existingTable = document.getElementById('bilibili-stats-table');
        
        if (existingTable) {
            // 更新现有表格的数据
            const newStats = getVideoStats();
            if (newStats) {
                // 更新标题和UP主的值，保持标签文字不变
                const titleElement = existingTable.querySelector('[style*="margin-bottom: 10px"]');
                if (titleElement) {
                    const titleLabel = titleElement.querySelector('span[style*="color: #666"]');
                    const titleContent = titleElement.lastChild;
                    if (titleContent) {
                        titleContent.textContent = newStats.title;
                        if (titleLabel) {
                            titleLabel.textContent = '标题：';  // 确保标签文字保持不变
                        }
                    }
                }

                const uploaderElement = existingTable.querySelector('[style*="color: #00a1d6; font-weight: 500;"]');
                if (uploaderElement) {
                    const upLabel = uploaderElement.querySelector('span[style*="color: #666"]');
                    const upContent = uploaderElement.lastChild;
                    if (upContent) {
                        upContent.textContent = newStats.uploader;
                        if (upLabel) {
                            upLabel.textContent = 'UP：';  // 确保标签文字保持不变
                        }
                    }
                }

                // 更新统计数据
                const statsMap = {
                    '发布时间': newStats.publishDate,
                    '播放量': newStats.playCount,
                    '弹幕数': newStats.danmakuCount,
                    '点赞数': newStats.likeCount,
                    '投币数': newStats.coinCount,
                    '收藏数': newStats.favoriteCount,
                    '分享数': newStats.shareCount
                };

                Object.entries(statsMap).forEach(([key, value]) => {
                    const statElement = Array.from(existingTable.querySelectorAll('div[style*="justify-content: space-between"]'))
                        .find(el => el.textContent.includes(key));
                    if (statElement) {
                        const valueSpan = statElement.querySelector('span[style*="color: #00a1d6"]');
                        if (valueSpan) valueSpan.textContent = value;
                    }
                });
            }
        } else {
            // 如果表格不存在，创建新表格
            createStatsTable();
        }

        requestAnimationFrame(update);
    }

    update();
}

// 监听URL变化
let lastUrl = location.href;
new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        // 当URL变化时，移除旧表格并重新初始化
        const existingTable = document.getElementById('bilibili-stats-table');
        if (existingTable) {
            existingTable.remove();
        }
        init();
    }
}).observe(document, {subtree: true, childList: true});

// 初始加载
init();

// 获取视频发布时间并添加到数据统计区域
function addPublishDate() {
    // 获取视频发布时间
    const publishTime = document.querySelector('meta[itemprop="uploadDate"]')?.content;
    
    if (publishTime) {
        // 格式化时间
        const formattedTime = new Date(publishTime).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        // 创建发布时间元素
        const publishDateSpan = document.createElement('span');
        publishDateSpan.className = 'pubdate-ip-text';
        publishDateSpan.textContent = formattedTime;

        // 找到视频数据计区域
        const statsArea = document.querySelector('.video-data');
        
        if (statsArea) {
            // 在数据统计区域的开头插入发布时间
            statsArea.insertBefore(publishDateSpan, statsArea.firstChild);
        }
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', addPublishDate); 