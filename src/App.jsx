import { useState } from 'react';
import { StoreProvider, useStore } from './store';
import OpportunityDetail from './components/OpportunityDetail';
import ActionsLog from './components/ActionsLog';
import AgentDetail from './components/AgentDetail';
import Settings from './components/Settings';
import Payments from './components/Payments';
import Gadgets from './components/Gadgets';
import Chat from './components/Chat';
import CashFlow from './components/CashFlow';
import Catalog from './components/Catalog';
import Reports from './components/Reports';
import Predict from './components/Predict';
import BottomNav from './components/BottomNav';
import Toasts from './components/Toasts';
import Modal from './components/Modal';
import NotificationsPanel from './components/NotificationsPanel';

function Shell() {
  const { pushToast, openModal } = useStore();
  const [page, setPage] = useState('chat');
  const [pageParams, setPageParams] = useState({});
  const [notifOpen, setNotifOpen] = useState(false);

  const navigate = (to, params = {}) => {
    setPage(to);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.querySelector('.shell-content')?.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <div className="app">
      <div className="phone-frame">
        <div className="dynamic-island" />

        <div className="shell">
          <div className="shell-content">
            <div key={page} className="page-fade">
              {page === 'negocio'  && <Gadgets  onNavigate={navigate} />}
              {page === 'payments' && <Payments onNavigate={navigate} />}
              {page === 'chat' && <Chat onNavigate={navigate} />}
              {page === 'cashflow' && <CashFlow onBack={() => navigate(pageParams.from || 'home')} />}
              {page === 'opportunity' && <OpportunityDetail onBack={() => navigate('chat')} />}
              {page === 'log' && <ActionsLog onBack={() => navigate('chat')} />}
              {page === 'config' && <Settings onBack={() => navigate('chat')} />}
              {page === 'catalog' && <Catalog onBack={() => navigate('chat')} />}
              {page === 'reports' && (
                <Reports
                  onBack={() => navigate('chat')}
                  defaultSection={pageParams.section || 'ventas'}
                  pushToast={pushToast}
                  openModal={openModal}
                />
              )}
              {page === 'agent' && (
                <AgentDetail agentId={pageParams.agentId} onBack={() => navigate('chat')} onNavigate={navigate} />
              )}
              {page === 'predict' && <Predict onBack={() => navigate('chat')} />}
            </div>
          </div>

          <BottomNav
            current={['agent', 'opportunity', 'cashflow', 'log', 'chat', 'catalog', 'reports', 'predict'].includes(page) ? 'chat' : (page === 'payments' ? 'negocio' : page)}
            onNavigate={navigate}
          />
        </div>

        <div className="home-bar" />
      </div>

      <NotificationsPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        onNavigate={navigate}
      />
      <Toasts />
      <Modal />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
