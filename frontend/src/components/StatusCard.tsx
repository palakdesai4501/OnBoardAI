type StatusType = 'info' | 'success' | 'warning' | 'error';

interface StatusCardProps {
  type: StatusType;
  title: string;
  message: string;
}

export default function StatusCard({ type, title, message }: StatusCardProps) {
  const styles = {
    info: {
      container: 'bg-white border-[#F5F7FA]',
      icon: 'text-[#022043]',
      title: 'text-[#022043]',
      message: 'text-[#4A5568]'
    },
    success: {
      container: 'bg-green-50 border-green-200',
      icon: 'text-green-600',
      title: 'text-green-800',
      message: 'text-green-700'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-800',
      message: 'text-yellow-700'
    },
    error: {
      container: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      title: 'text-red-800',
      message: 'text-red-700'
    }
  };

  const style = styles[type];

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${style.container}`}>
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 ${style.icon}`}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold mb-1 ${style.title}`}>{title}</h3>
          <p className={`text-sm ${style.message}`}>{message}</p>
        </div>
      </div>
    </div>
  );
}

