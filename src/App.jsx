/*
import { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import './App.css';

function App() {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: { backgroundColor: '#fff', textColor: '#333' },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    const fetchBinanceData = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=10');
        const data = await res.json();
        const formatted = data.map(k => ({
          time: k[0] / 1000,
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
        }));
        candlestickSeries.setData(formatted);
      } catch (e) {
        console.error(e);
      }
    };

    fetchBinanceData();

    return () => chart.remove();
  }, []);

  return (
    <div className="App">
      <h1 style={{ textAlign: 'center' }}>Binance API - Mum Grafiği</h1>
      <div ref={chartContainerRef} style={{ width: '90%', height: '500px', margin: '20px auto' }} />
    </div>
  );
}

export default App;
*/
//V1
//-----------------------------------------------------------------------------


/*
// 1. Gerekli kancaları (hooks) import ediyoruz: useState eklendi
import { useEffect, useRef, useState } from 'react';

// 2. lightweight-charts importları (Sizin sağladığınız doğru yöntem)
import { createChart, CandlestickSeries } from 'lightweight-charts';
import './App.css';

// 3. (YENİ) Kodları (1d) okunabilir metne (1 Günlük) çevirmek için bir yardımcı nesne
const intervalMap = {
  '1h': '1 Saatlik',
  '1d': '1 Günlük',
  '1w': '1 Haftalık',
  '1M': '1 Aylık',
};

function App() {
  const chartContainerRef = useRef(null);

  // 4. (YENİ) State tanımlamaları
  // Hangi zaman aralığının seçili olduğunu tutar. Varsayılan: '1d'
  const [interval, setInterval] = useState('1d'); 
  // Oluşturulan 'series' nesnesini state'te tutarız, böylece ona
  // veri yüklemek için başka bir useEffect içinden erişebiliriz.
  const [series, setSeries] = useState(null);

  // 5. (DEĞİŞTİ) useEffect 1: Grafik Kurulumu (Sadece 1 kez çalışır)
  // Bu useEffect'in bağımlılık dizisi [] boştur.
  // Sadece component ilk yüklendiğinde çalışır, grafiği kurar ve temizler.
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Grafiği oluştur
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: { backgroundColor: '#fff', textColor: '#333' },
      grid: { // Daha belirgin ızgara çizgileri
        vertLines: { color: '#eef' },
        horzLines: { color: '#eef' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      }
    });

    // Seriyi oluştur (Sizin doğru v5 yönteminizle)
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // (YENİ) Oluşturduğumuz seriyi, daha sonra veri basmak için state'e kaydediyoruz.
    setSeries(candlestickSeries);

    // Temizleme fonksiyonu: Component ekrandan kaldırılırsa grafiği sil
    return () => {
      chart.remove();
    };
  }, []); // [] -> Bağımlılık dizisi boş = Sadece 1 kez çalışır.

  // 6. (YENİ) useEffect 2: Veri Çekme (Interval değiştikçe çalışır)
  // Bu useEffect, 'series' nesnesi hazır olduğunda VE 'interval' her değiştiğinde çalışır.
  useEffect(() => {
    // 'series' state'i henüz ayarlanmadıysa (ilk render anı) hiçbir şey yapma
    if (!series) return; 

    const fetchBinanceData = async () => {
      try {
        // (DEĞİŞTİ) URL artık dinamik! 'interval' state'ini kullanıyor.
        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=XRPUSDT&interval=${interval}&limit=100`
        );
        const data = await res.json();
        const formatted = data.map(k => ({
          time: k[0] / 1000,
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
        }));
        
        // (DEĞİŞTİ) Veriyi, state'ten aldığımız 'series' nesnesine basıyoruz.
        series.setData(formatted);
      } catch (e) {
        console.error(e);
      }
    };

    fetchBinanceData();
    
  }, [interval, series]); // [interval, series] -> 'interval' veya 'series' değiştiğinde bu kodu yeniden çalıştır.

  // 7. (DEĞİŞTİ) JSX Render Kısmı
  return (
    <div className="App">
      <h1 style={{ textAlign: 'center' }}>Binance API - Mum Grafiği</h1>
      
      
      <h3 style={{ textAlign: 'center' }}>
        BTC/USDT ({intervalMap[interval] || 'Yükleniyor...'})
      </h3>

      
      <div style={{ textAlign: 'center', margin: '20px' }}>
        <button style={{ margin: '5px' }} onClick={() => setInterval('1h')}>1 Saat</button>
        <button style={{ margin: '5px' }} onClick={() => setInterval('1d')}>1 Gün</button>
        <button style={{ margin: '5px' }} onClick={() => setInterval('1w')}>1 Hafta</button>
        <button style={{ margin: '5px' }} onClick={() => setInterval('1M')}>1 Ay</button>
      </div>

      
      <div ref={chartContainerRef} style={{ width: '90%', height: '500px', margin: '20px auto' }} />
    </div>
  );
}

export default App;
*/
//V2
//----------------------------------------------------------------------------- 

// src/App.jsx

/*
import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import './App.css';

// 1. (DEĞİŞTİ) 1m (1 Dakika) eklendi ve map'e de eklendi
const intervalMap = {
  '1m': '1 Dakikalık',
  '1h': '1 Saatlik',
  '1d': '1 Günlük',
  '1w': '1 Haftalık',
};
const symbol = 'BTCUSDT';

function App() {
  const chartContainerRef = useRef(null);
  
  // 2. (DEĞİŞTİ) Varsayılan interval '1m' (1 Dakika) olsun ki canlı veriyi görelim
  const [interval, setInterval] = useState('1m'); 
  const [series, setSeries] = useState(null);

  // 3. useEffect 1: Grafik Kurulumu (Aynı kaldı, Sadece 1 kez çalışır)
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: { backgroundColor: '#fff', textColor: '#333' },
      grid: { vertLines: { color: '#eef' }, horzLines: { color: '#eef' } },
      timeScale: {
        timeVisible: true,
        secondsVisible: true, // 1m için bunu 'true' yapabilirsiniz
      }
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    setSeries(candlestickSeries);

    return () => {
      chart.remove();
    };
  }, []); 

  // 4. (DEĞİŞTİ) useEffect 2: Veri Yöneticisi (Geçmiş + Canlı)
  useEffect(() => {
    if (!series) return; // Seri hazır değilse çık

    // 4a. Geçmiş Veriyi Çek (REST API)
    const fetchHistoricalData = async () => {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=200`
        );
        const data = await res.json();
        const formatted = data.map(k => ({
          time: k[0] / 1000,
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
        }));
        
        // ÖNEMLİ: Grafiği 'setData' ile dolduruyoruz (tüm veriyi yüklüyoruz)
        series.setData(formatted);
      } catch (e) {
        console.error(e);
      }
    };

    // 4b. Canlı Veriye Abone Ol (WebSocket)
    
    // Geçmiş veriyi çektikten SONRA WebSocket'e bağlan
    fetchHistoricalData().then(() => {
      // WebSocket bağlantısını kur
      const ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
      );

      ws.onopen = () => {
        console.log(`WebSocket ${interval} yayınına bağlandı.`);
      };

      // WebSocket'ten mesaj geldiğinde...
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        // Gelen verinin bir 'kline' (mum) verisi olduğundan emin ol
        if (message.e === 'kline') {
          const k = message.k; // Gelen mum verisi
          
          // Yeni mumu grafiğin istediği formata çevir
          const newCandle = {
            time: k.t / 1000,
            open: parseFloat(k.o),
            high: parseFloat(k.h),
            low: parseFloat(k.l),
            close: parseFloat(k.c),
          };

          // ÖNEMLİ: Grafiği 'update' ile güncelliyoruz (sadece son mumu)
          series.update(newCandle);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket Hatası:', error);
      };

      // 4c. Temizlik Fonksiyonu (ÇOK ÖNEMLİ)
      // 'interval' değiştiğinde (örn: 1m'den 1h'ye geçince)
      // bu 'useEffect' yeniden çalışmadan önce, 'cleanup' fonksiyonu tetiklenir.
      // Bu fonksiyon, mevcut WebSocket bağlantısını kapatır.
      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
          console.log(`WebSocket ${interval} bağlantısı kapatıldı.`);
        }
      };
    });
    
  }, [interval, series]); // 'interval' veya 'series' değiştiğinde bu kodu yeniden çalıştır.

  // 5. (DEĞİŞTİ) Render Kısmı (1m butonu eklendi)
  return (
    <div className="App">
      <h1 style={{ textAlign: 'center' }}>Binance API - Canlı Mum Grafiği</h1>
      
      <h3 style={{ textAlign: 'center' }}>
        {symbol} ({intervalMap[interval] || 'Yükleniyor...'})
      </h3>

      <div style={{ textAlign: 'center', margin: '20px' }}>
       
        <button style={{ margin: '5px' }} onClick={() => setInterval('1m')}>1 Dakika</button>
        <button style={{ margin: '5px' }} onClick={() => setInterval('1h')}>1 Saat</button>
        <button style={{ margin: '5px' }} onClick={() => setInterval('1d')}>1 Gün</button>
        <button style={{ margin: '5px' }} onClick={() => setInterval('1w')}>1 Hafta</button>
      </div>

      <div ref={chartContainerRef} style={{ width: '90%', height: '500px', margin: '20px auto' }} />
    </div>
  );
}

export default App;
*/
//V3
//-----------------------------------------------------------------------------

// src/App.jsx

/*
import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import './App.css';

const intervalMap = {
  '1s': '1 Saniyelik', // Artık BNB ile sınırlı değil
  '1m': '1 Dakikalık',
  '1h': '1 Saatlik',
  '1d': '1 Günlük',
};
// 1. Sembolü sabit olarak tanımlıyoruz. Değişmeyecek.
const symbol = 'BTCUSDT'; 

function App() {
  const chartContainerRef = useRef(null);
  
  const [interval, setInterval] = useState('1s'); 
  const [series, setSeries] = useState(null);
  
  // 2. Artık 'currentSymbol' state'ine ihtiyacımız yok, çünkü hep BTCUSDT
  // const [currentSymbol, setCurrentSymbol] = useState('BTCUSDT'); // BU SATIR SİLİNDİ

  // 4. useEffect 1: Grafik Kurulumu (Aynı kaldı)
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: { backgroundColor: '#fff', textColor: '#333' },
      grid: { vertLines: { color: '#eef' }, horzLines: { color: '#eef' } },
      timeScale: {
        timeVisible: true,
        secondsVisible: true, 
        tickMarkFormatter: (time) => {
          const date = new Date(time * 1000);
          return date.toLocaleTimeString('tr-TR', { hour12: false });
        },
      }
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    setSeries(candlestickSeries);

    return () => {
      chart.remove();
    };
  }, []); 

  // 5. useEffect 2: Veri Yöneticisi (DEĞİŞTİ ve BASİTLEŞTİ)
  useEffect(() => {
    if (!series) return; 

    // 5a. (SİLİNDİ) Sembol değiştiren if/else bloğu tamamen kaldırıldı.
    // 'symbol' her zaman 'BTCUSDT' olacak.

    // 5b. Geçmiş Veri çekme fonksiyonu (Aynı kaldı)
    const fetchHistoricalData = async () => {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=200`
        );
        const data = await res.json();
        const formatted = data.map(k => ({
          time: k[0] / 1000,
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
        }));
        series.setData(formatted); 
      } catch (e) {
        console.error(e);
      }
    };

    // 5c. WebSocket bağlantı fonksiyonu (Aynı kaldı)
    const connectWebSocket = () => {
      const ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
      );

      ws.onopen = () => {
        console.log(`WebSocket ${symbol} ${interval} yayınına bağlandı.`);
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.e === 'kline') {
          const k = message.k;
          const newCandle = {
            time: k.t / 1000,
            open: parseFloat(k.o),
            high: parseFloat(k.h),
            low: parseFloat(k.l),
            close: parseFloat(k.c),
          };
          series.update(newCandle);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket Hatası:', error);
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
          console.log(`WebSocket ${symbol} ${interval} bağlantısı kapatıldı.`);
        }
      };
    };

    // 5d. Ana Mantık (Aynı kaldı)
    let cleanupWebSocket = () => {};

    if (interval === '1s') {
      // 1s için geçmiş veri yok, grafiği temizle ve bağlan
      series.setData([]); 
      cleanupWebSocket = connectWebSocket();
    } else {
      // Diğerleri için önce geçmişi çek, sonra bağlan
      fetchHistoricalData().then(() => {
        cleanupWebSocket = connectWebSocket();
      });
    }
    
    return () => {
      cleanupWebSocket();
    };

  }, [interval, series]);

  // 6. Render Kısmı (DEĞİŞTİ)
  return (
    <div className="App">
      <h1 style={{ textAlign: 'center' }}>Binance API - Canlı Mum Grafiği</h1>
      
      <h3 style={{ textAlign: 'center' }}>
        
        {symbol} ({intervalMap[interval] || 'Yükleniyor...'})
      </h3>

      <div style={{ textAlign: 'center', margin: '20px' }}>
        
        <button style={{ margin: '5px' }} onClick={() => setInterval('1s')}>1 Saniye</button>
        <button style={{ margin: '5px' }} onClick={() => setInterval('1m')}>1 Dakika</button>
        <button style={{ margin: '5px' }} onClick={() => setInterval('1h')}>1 Saat</button>
        <button style={{ margin: '5px' }} onClick={() => setInterval('1d')}>1 Gün</button>
      </div>

      <div ref={chartContainerRef} style={{ width: '90%', height: '500px', margin: '20px auto' }} />
    </div>
  );
}

export default App;
*/
//V4
//-----------------------------------------------------------------------------

import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import './App.css';

// 1. (YENİ) Seçilebilir coin'lerin statik listesi
const popularCoins = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT'];

// 2. (YENİ) Interval'leri de bir liste/harita olarak tanımlamak daha temiz olacak
const intervalMap = {
  '1s': '1 Saniyelik',
  '1m': '1 Dakikalık',
  '1h': '1 Saatlik',
  '1d': '1 Günlük',
};
// Butonları oluşturmak için interval kodlarının bir listesi
const intervals = ['1s', '1m', '1h', '1d'];

function App() {
  const chartContainerRef = useRef(null);
  
  const [interval, setInterval] = useState('1s'); 
  const [series, setSeries] = useState(null);
  
  // 3. (YENİ) Hangi coin'in seçili olduğunu tutan state.
  // Varsayılan olarak listemizdeki ilk coin (BTCUSDT) olsun.
  const [symbol, setSymbol] = useState(popularCoins[0]); 

  // 4. useEffect 1: Grafik Kurulumu (Hiçbir değişiklik yok)
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: { backgroundColor: '#fff', textColor: '#333' },
      grid: { vertLines: { color: '#eef' }, horzLines: { color: '#eef' } },
      timeScale: {
        timeVisible: true,
        secondsVisible: true, 
        tickMarkFormatter: (time) => {
          const date = new Date(time * 1000);
          return date.toLocaleTimeString('tr-TR', { hour12: false });
        },
      }
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    setSeries(candlestickSeries);

    return () => {
      chart.remove();
    };
  }, []); 

  // 5. useEffect 2: Veri Yöneticisi (ÇOK ÖNEMLİ DEĞİŞİKLİK)
  useEffect(() => {
    if (!series) return; 

    // 5a. Geçmiş Veri çekme fonksiyonu
    // (DEĞİŞTİ) Artık 'symbol' state'ini kullanıyor
    const fetchHistoricalData = async () => {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=200`
        );
        const data = await res.json();
        const formatted = data.map(k => ({
          time: k[0] / 1000,
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
        }));
        series.setData(formatted); 
      } catch (e) {
        console.error(e);
      }
    };

    // 5b. WebSocket bağlantı fonksiyonu
    // (DEĞİŞTİ) Artık 'symbol' state'ini kullanıyor
    const connectWebSocket = () => {
      const ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
      );

      ws.onopen = () => {
        console.log(`WebSocket ${symbol} ${interval} yayınına bağlandı.`);
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.e === 'kline') {
          const k = message.k;
          const newCandle = {
            time: k.t / 1000,
            open: parseFloat(k.o),
            high: parseFloat(k.h),
            low: parseFloat(k.l),
            close: parseFloat(k.c),
          };
          series.update(newCandle);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket Hatası:', error);
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
          console.log(`WebSocket ${symbol} ${interval} bağlantısı kapatıldı.`);
        }
      };
    };

    // 5c. Ana Mantık (Hiçbir değişiklik yok, çünkü 'symbol' ve 'interval'
    // zaten fonksiyonlar tarafından state'ten alınıyor)
    let cleanupWebSocket = () => {};

    if (interval === '1s') {
      series.setData([]); 
      cleanupWebSocket = connectWebSocket();
    } else {
      fetchHistoricalData().then(() => {
        cleanupWebSocket = connectWebSocket();
      });
    }
    
    return () => {
      cleanupWebSocket();
    };

    // 6. (EN ÖNEMLİ DEĞİŞİKLİK) Bağımlılık (dependency) dizisi
    // Artık bu kod, 'interval' VEYA 'symbol' değiştiğinde yeniden çalışacak.
  }, [interval, symbol, series]); 

  // 7. (DEĞİŞTİ) Render Kısmı (Coin butonları eklendi)
  return (
    <div className="App">
      <h1 style={{ textAlign: 'center' }}>Binance API - Canlı Mum Grafiği</h1>
      
      <h3 style={{ textAlign: 'center' }}>
        {/* Başlık artık 'symbol' state'inden besleniyor */}
        {symbol} ({intervalMap[interval] || 'Yükleniyor...'})
      </h3>

      {/* (YENİ) Coin seçme butonları */}
      <div style={{ textAlign: 'center', margin: '20px' }}>
        <strong>Coin Seçin:</strong>
        {popularCoins.map((coin) => (
          <button 
            key={coin}
            style={{ margin: '5px' }} 
            onClick={() => setSymbol(coin)}
            // Seçili olan butonu pasif yap (görsel kolaylık)
            disabled={symbol === coin} 
          >
            {coin}
          </button>
        ))}
      </div>

      {/* Zaman aralığı butonları (Daha temiz olması için map ile yeniden yazıldı) */}
      <div style={{ textAlign: 'center', margin: '20px' }}>
        <strong>Aralık Seçin:</strong>
        {intervals.map((int) => (
          <button 
            key={int}
            style={{ margin: '5px' }} 
            onClick={() => setInterval(int)}
            disabled={interval === int}
          >
            {intervalMap[int]} {/* '1s' yerine '1 Saniyelik' yazar */}
          </button>
        ))}
      </div>

      <div ref={chartContainerRef} style={{ width: '90%', height: '500px', margin: '20px auto' }} />
    </div>
  );
}

export default App;