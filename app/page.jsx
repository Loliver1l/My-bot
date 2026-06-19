"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function PremiumTradingSuite() {
    const [mainTab, setMainTab] = useState('Bot Builder');
    const [isRunning, setIsRunning] = useState(false);
    const [balance, setBalance] = useState(10542.80);
    const [stake, setStake] = useState("10");
    const [takeProfit, setTakeProfit] = useState("20");
    const [martingale, setMartingale] = useState("2");
    
    const [tickStream, setTickStream] = useState([7, 3, 2, 9, 4, 1, 5, 8, 0, 6, 3, 5, 2, 9, 4, 7, 7, 1, 3, 5]);
    const [digitFrequencies, setDigitFrequencies] = useState(Array(10).fill(0));
    const [colorSignals, setColorSignals] = useState({ green: '-', blue: '-', yellow: '-', red: '-' });
    const streamIntervalRef = useRef(null);
    const [stats, setStats] = useState({ totalTrades: 142, wins: 89, losses: 53, netProfit: 340.50 });

    useEffect(() => {
        const counts = Array(10).fill(0);
        tickStream.forEach(num => { if(num >= 0 && num <= 9) counts[num]++; });
        setDigitFrequencies(counts);

        const mappedData = counts
            .map((count, digit) => ({ digit, count }))
            .sort((a, b) => b.count - a.count);

        setColorSignals({
            green: `Digit ${mappedData[0].digit} (${mappedData[0].count}x)`,
            blue: `Digit ${mappedData[1].digit} (${mappedData[1].count}x)`,
            yellow: `Digit ${mappedData[8].digit} (${mappedData[8].count}x)`,
            red: `Digit ${mappedData[9].digit} (${mappedData[9].count}x)`
        });
    }, [tickStream]);

    const toggleEngineExecution = () => {
        if (isRunning) {
            if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
            streamIntervalRef.current = null;
            setIsRunning(false);
        } else {
            setIsRunning(true);
            streamIntervalRef.current = setInterval(() => {
                const nextDigit = Math.floor(Math.random() * 10);
                setTickStream(prev => {
                    const updated = [...prev, nextDigit];
                    if (updated.length > 25) updated.shift();
                    return updated;
                });

                setStats(current => {
                    const isWin = Math.random() > 0.44; 
                    const tradeStake = parseFloat(stake) || 10;
                    const change = isWin ? (tradeStake * 0.95) : -tradeStake;
                    setBalance(b => b + change);
                    return {
                        totalTrades: current.totalTrades + 1,
                        wins: current.wins + (isWin ? 1 : 0),
                        losses: current.losses + (isWin ? 0 : 1),
                        netProfit: parseFloat((current.netProfit + change).toFixed(2))
                    };
                });
            }, 1000);
        }
    };

    useEffect(() => {
        return () => { if (streamIntervalRef.current) clearInterval(streamIntervalRef.current); };
    }, [isRunning]);

    return (
        <div style={{ backgroundColor: '#0e1017', minHeight: '100vh', fontFamily: 'sans-serif', color: '#e2e8f0', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ backgroundColor: '#161922', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #262a36' }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff' }}>
                    mkoreanwwn<span style={{ color: '#ff444f' }}>.site</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>ACCOUNT BALANCE</span>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#4ade80' }}>${balance.toFixed(2)}</span>
                </div>
            </div>

            <div style={{ backgroundColor: '#1a1d29', display: 'flex', overflowX: 'auto', borderBottom: '1px solid #2b3045', padding: '2px 4px' }}>
                {['Dashboard', 'Bot Builder', 'Charts', 'Analysis Tool', 'Copy Trading', 'DTrader', 'TradingView'].map(tab => (
                    <div 
                        key={tab}
                        onClick={() => setMainTab(tab)}
                        style={{ 
                            padding: '12px 18px', color: mainTab === tab ? '#ffffff' : '#94a3b8', 
                            fontWeight: mainTab === tab ? '700' : '500', fontSize: '13px', cursor: 'pointer',
                            borderBottom: mainTab === tab ? '3px solid #ff444f' : '3px solid transparent',
                            backgroundColor: mainTab === tab ? '#222738' : 'transparent', whiteSpace: 'nowrap'
                        }}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            <div style={{ padding: '16px', flex: 1, paddingBottom: '110px' }}>
                {mainTab === 'Dashboard' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div style={{ background: '#161922', padding: '16px', borderRadius: '8px', border: '1px solid #262a36' }}>
                                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Total Trades</span>
                                <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#fff' }}>{stats.totalTrades}</div>
                            </div>
                            <div style={{ background: '#161922', padding: '16px', borderRadius: '8px', border: '1px solid #262a36' }}>
                                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Net Yield Profit</span>
                                <div style={{ fontSize: '26px', fontWeight: 'bold', color: stats.netProfit >= 0 ? '#4ade80' : '#ff444f' }}>
                                    ${stats.netProfit}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {mainTab === 'Bot Builder' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ background: '#161922', padding: '16px', borderRadius: '8px', border: '1px solid #262a36' }}>
                            <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '12px', color: '#cbd5e1' }}>📊 Real-time Color Signals Tracker</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div style={{ padding: '12px', borderRadius: '6px', background: '#1e2230', borderLeft: '5px solid #4ade80' }}>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>🟢 GREEN (Most)</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{colorSignals.green}</div>
                                </div>
                                <div style={{ padding: '12px', borderRadius: '6px', background: '#1e2230', borderLeft: '5px solid #38bdf8' }}>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>🔵 BLUE (2nd Most)</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{colorSignals.blue}</div>
                                </div>
                                <div style={{ padding: '12px', borderRadius: '6px', background: '#1e2230', borderLeft: '5px solid #fb923c' }}>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>🟡 YELLOW (2nd Least)</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{colorSignals.yellow}</div>
                                </div>
                                <div style={{ padding: '12px', borderRadius: '6px', background: '#1e2230', borderLeft: '5px solid #ff444f' }}>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>🔴 RED (Least)</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{colorSignals.red}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: '#161922', borderRadius: '8px', border: '1px solid #262a36', overflow: 'hidden' }}>
                            <div style={{ background: '#22c55e', color: '#fff', padding: '12px 16px', fontWeight: 'bold', fontSize: '14px' }}>📋 Setup Execution Blocks</div>
                            <div style={{ background: '#0f111a', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#161922', padding: '8px 12px', borderRadius: '4px', borderLeft: '5px solid #ff444f' }}>
                                    <span style={{ color: '#94a3b8' }}>set STAKE to</span>
                                    <input type="number" value={stake} onChange={(e) => setStake(e.target.value)} style={{ width: '60px', padding: '4px', background: '#1e2230', border: '1px solid #3b4252', color: '#fff', textAlign: 'center' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {mainTab === 'Charts' && (
                    <div style={{ background: '#161922', padding: '20px', borderRadius: '8px', border: '1px solid #262a36', textAlign: 'center' }}>
                        <h3>📊 Continuous Market Feed Ticks</h3>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', background: '#0f111a', padding: '24px', borderRadius: '6px', marginTop: '15px' }}>
                            {tickStream.map((tick, index) => (
                                <div key={index} style={{ padding: '10px 14px', borderRadius: '4px', background: index === tickStream.length - 1 ? '#ff444f' : '#1e2230', color: '#fff', fontWeight: 'bold' }}>
                                    {tick}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {mainTab === 'Analysis Tool' && <div style={{ background: '#161922', padding: '20px', borderRadius: '8px' }}><h3>📊 Advanced Probability Analysis Panel</h3></div>}
                {mainTab === 'Copy Trading' && <div style={{ background: '#161922', padding: '20px', borderRadius: '8px' }}><h3>👥 Professional Copy Allocation Network</h3></div>}
                {mainTab === 'DTrader' && <div style={{ background: '#161922', padding: '20px', borderRadius: '8px' }}><h3>🎯 Manual Order Execution Terminal</h3></div>}
                {mainTab === 'TradingView' && <div style={{ background: '#161922', padding: '20px', borderRadius: '8px' }}><h3>👁️ External Technical Indicators Core</h3></div>}
            </div>

            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#161922', padding: '14px 20px', display: 'flex', alignItems: 'center', borderTop: '1px solid #262a36', zIndex: 1000 }}>
                <button onClick={toggleEngineExecution} style={{ backgroundColor: isRunning ? '#ff444f' : '#2ca5ba', color: '#fff', border: 'none', padding: '14px 36px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {isRunning ? '🛑 STOP CORE' : '▶️ RUN CORE'}
                </button>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>ENGINE STATE</span>
                    <span style={{ fontWeight: 'bold', color: isRunning ? '#4ade80' : '#94a3b8' }}>{isRunning ? 'ACTIVE ANALYSIS' : 'STANDBY MODE'}</span>
                </div>
            </div>

        </div>
    );
}
