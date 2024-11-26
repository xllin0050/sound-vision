# Sound Vision

Sound Vision 是一個互動式音樂視覺化網頁應用程序，能夠根據音樂的節奏和振幅生成動態的視覺效果。

## 特點

- 🎵 實時音樂視覺化
- 🎨 多色彩動態曲線效果
- 🎥 視覺效果錄製功能
- 🎮 互動式控制界面
- 🎯 BPM 同步視覺效果
- 🌈 自定義顏色系統

## 技術棧

- **前端框架**
  - HTML5
  - CSS3 (Material Design)
  - JavaScript (ES6+)

- **視覺化庫**
  - p5.js
  - p5.sound.js

- **UI 組件**
  - Material Icons
  - Google Fonts (Roboto)

- **特殊效果**
  - Canvas API
  - Web Audio API
  - MediaRecorder API

## 主要功能

### 音樂播放控制
- 支持 MP3、WAV、AIFF 格式
- 播放/暫停控制
- 音量響應式視覺效果

### 視覺效果
- 動態曲線生成
- 粒子系統
- 音頻振幅響應
- BPM 同步動畫
- 多重顏色圖層

### 錄製功能
- WebM 格式視頻錄製
- 60FPS 高品質輸出
- 5Mbps 視頻比特率
- 一鍵式錄製/下載

### 用戶界面
- Material Design 風格
- 半透明控制面板
- 響應式設計
- 直觀的顏色選擇器
- BPM 調節控制

## 文件結構

```
sound-vision/
│
├── index.html      # 主要 HTML 結構
├── styles.css      # Material Design 樣式
├── script.js       # 應用邏輯和視覺化代碼
└── README.md       # 項目文檔
```

## 使用方法

1. 選擇音樂文件（支持 MP3、WAV、AIFF）
2. 使用播放按鈕控制音樂播放
3. 調整 BPM 以改變視覺效果的節奏
4. 添加/移除顏色以自定義視覺效果
5. 使用錄製按鈕捕獲視覺效果

## 技術特點

### 視覺化算法
- 基於音頻振幅的動態曲線生成
- 粒子系統的物理模擬
- 平滑的顏色過渡效果
- 基於 BPM 的動畫同步

### 性能優化
- 使用 requestAnimationFrame 實現流暢動畫
- 智能粒子系統管理
- 優化的 Canvas 渲染
- 異步音頻處理

### UI/UX 設計
- 半透明毛玻璃效果
- 響應式控制面板
- 直觀的用戶交互
- 即時視覺反饋

## 瀏覽器支持

- Google Chrome (推薦)
- Firefox
- Safari
- Edge

## 建議的系統配置

- 現代網頁瀏覽器
- 支持 WebGL 的顯卡
- 建議螢幕分辨率：1920x1080 或更高
- 穩定的音頻輸出設備
