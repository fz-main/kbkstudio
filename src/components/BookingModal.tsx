import React, { useState } from 'react';
import { BookingForm } from './BookingForm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
}

export const BookingModal: React.FC<Props> = ({ isOpen, onClose, serviceId, serviceName, durationMinutes }) => {
  const [confirmed, setConfirmed] = useState(false);
  if (!isOpen) return null;
  const handleClose = () => { setConfirmed(false); onClose(); };
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="bg-[#0a0a0a] rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold text-white">
            {confirmed ? 'Rezervace potvrzena!' : `Rezervace: ${serviceName}`}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>
        <div className="p-6">
          {confirmed ? (
            <div className="text-center space-y-4 py-4">
              <div className="text-5xl">🎉</div>
              <h3 className="text-xl font-semibold text-white">Vaše rezervace je potvrzena!</h3>
              <p className="text-gray-400">Obratem vás budeme kontaktovat pro potvrzení.</p>
              <button onClick={handleClose} className="w-full bg-[#e5d3b3] text-black py-2 rounded-lg font-medium hover:bg-white transition-colors">Hotovo</button>
            </div>
          ) : (
            <BookingForm serviceId={serviceId} serviceName={serviceName}
              durationMinutes={durationMinutes} onSuccess={() => setConfirmed(true)} onCancel={handleClose} />
          )}
        </div>
      </div>
    </div>
  );
};
