'use client';
import { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

export default function SwapPage() {
  const { address, isConnected } = useAccount();
  const { connect: connectInjected } = useConnect({ connector: new InjectedConnector() });
  const { connect: connectWalletConnect } = useConnect({ connector: new WalletConnectConnector({ projectId: 'YOUR_WC_PROJECT_ID_HERE' }) }); // Get free ID at walletconnect.com
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const [fromAmount, setFromAmount] = useState('');
  const [toToken] = useState('USDC'); // Example swap ETH to USDC
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSwap = async () => {
    if (!isConnected || !fromAmount) return alert('Connect wallet & enter amount!');
    const mode = isPrivate ? 'Privately (ZK-shielded like MuteSwap)' : 'Publicly';
    alert(`Swapping ${fromAmount} ETH to ${toToken} ${mode}... (Demo – add real DEX router next!)\nYour balance: ${balance?.formatted} ${balance?.symbol}`);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>My Private DEX Swap</h1>
      {!isConnected ? (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <button onClick={() => connectInjected()} style={{ background: '#f6851b', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', margin: '5px' }}>
            Connect MetaMask
          </button>
          <br />
          <button onClick={() => connectWalletConnect()} style={{ background: '#3b82f6', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', margin: '5px' }}>
            Connect WalletConnect
          </button>
        </div>
      ) : (
        <div>
          <p style={{ textAlign: 'center' }}>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
          <p>Balance: {balance?.formatted} {balance?.symbol}</p>
          <button onClick={() => disconnect()} style={{ background: '#ef4444', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}>Disconnect</button>
          <br /><br />
          <input
            type="number"
            placeholder="Amount to swap (ETH)"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <p>To: {toToken}</p>
          <label>
            <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
            Private Mode (ZK Privacy – Hides details like MuteSwap)
          </label>
          <br />
          <button onClick={handleSwap} style={{ background: '#10b981', color: 'white', padding: '15px', width: '100%', border: 'none', borderRadius: '5px', fontSize: '16px' }}>
            Swap Now!
          </button>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>Demo: Connects wallet, shows balance, simulates swap. Add 1inch/Uniswap router for real trades.</p>
        </div>
      )}
    </div>
  );
}
