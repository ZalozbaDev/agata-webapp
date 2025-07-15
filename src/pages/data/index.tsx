import React, { useState, useEffect } from 'react'
import { chatService, FetchedDataItem, DataRequest } from '../../services/api'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import { getErrorType } from '../../types/errors'

const DataPage: React.FC = () => {
  const [data, setData] = useState<FetchedDataItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<DataRequest>({
    type: '',
    limit: 10,
  })
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchData()
  }, [filters, currentPage])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params: DataRequest = {}
      if (filters.type) params.type = filters.type
      if (filters.limit) params.limit = filters.limit
      params.page = currentPage

      const response = await chatService.getData(params)
      setData(response.data)
      setTotalItems(response.total)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (
    key: keyof DataRequest,
    value: string | number
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Fetched Data</h1>
        <div style={countStyle}>Total: {totalItems} items</div>
      </div>

      {error && (
        <div style={{ marginBottom: '20px' }}>
          <ErrorMessage
            errorType={getErrorType({ message: error })}
            message={error}
            onRetry={fetchData}
          />
        </div>
      )}

      <div style={filtersStyle}>
        <div style={filterRowStyle}>
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Type:</label>
            <input
              type='text'
              placeholder='Filter by type'
              value={filters.type || ''}
              onChange={e => handleFilterChange('type', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={filterGroupStyle}>
            <label style={labelStyle}>Limit:</label>
            <select
              value={filters.limit || 10}
              onChange={e =>
                handleFilterChange('limit', Number(e.target.value))
              }
              style={selectStyle}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      <div style={tableContainerStyle}>
        {data.length === 0 ? (
          <div style={emptyStateStyle}>
            <p>No data found. Try adjusting your filters.</p>
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Content</th>
                <th style={thStyle}>URL</th>
                <th style={thStyle}>Timestamp</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item._id} style={trStyle}>
                  <td style={tdStyle}>
                    <span style={titleCellStyle}>
                      {item.title || 'No title'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={typeStyle}>{item.type}</span>
                  </td>
                  <td style={tdStyle}>
                    <div style={contentContainerStyle}>
                      <span style={contentStyle}>{item.content}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <a
                      href={item.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      style={linkStyle}
                    >
                      {truncateText(item.url, 50)}
                    </a>
                  </td>
                  <td style={tdStyle}>
                    <span style={dateStyle}>{formatDate(item.timestamp)}</span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => copyToClipboard(item.url)}
                      style={actionButtonStyle}
                      title='Copy URL'
                    >
                      📋
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {data.length > 0 && (
        <div style={paginationStyle}>
          <div style={paginationInfoStyle}>
            Page {currentPage} of{' '}
            {Math.ceil(totalItems / (filters.limit || 10))} ({totalItems} total
            items)
          </div>
          <div style={paginationControlsStyle}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={paginationButtonStyle}
            >
              Previous
            </button>
            <span style={pageInfoStyle}>{currentPage}</span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={
                currentPage >= Math.ceil(totalItems / (filters.limit || 10))
              }
              style={paginationButtonStyle}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Styles
const containerStyle: React.CSSProperties = {
  margin: '0 auto',
  padding: '20px',
  minHeight: 'calc(100vh - 48px)',
  maxWidth: '95vw',
  width: '100%',
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
}

const titleStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: '600',
  margin: 0,
  color: '#ececf1',
}

const countStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#8e8ea0',
  fontWeight: '500',
}

const filtersStyle: React.CSSProperties = {
  marginBottom: '30px',
  padding: '20px',
  backgroundColor: '#2a2a2a',
  borderRadius: '8px',
  border: '1px solid #404040',
}

const filterRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '20px',
  alignItems: 'center',
  flexWrap: 'wrap',
}

const filterGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: '500',
  color: '#ececf1',
}

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #404040',
  borderRadius: '4px',
  backgroundColor: '#1a1a1a',
  color: '#ececf1',
  fontSize: '0.9rem',
  minWidth: '150px',
}

const selectStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #404040',
  borderRadius: '4px',
  backgroundColor: '#1a1a1a',
  color: '#ececf1',
  fontSize: '0.9rem',
  minWidth: '80px',
}

const tableContainerStyle: React.CSSProperties = {
  backgroundColor: '#2a2a2a',
  borderRadius: '8px',
  border: '1px solid #404040',
  overflow: 'hidden',
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.9rem',
}

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  backgroundColor: '#1a1a1a',
  color: '#ececf1',
  fontWeight: '600',
  borderBottom: '1px solid #404040',
}

const trStyle: React.CSSProperties = {
  borderBottom: '1px solid #404040',
}

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  verticalAlign: 'top',
}

const titleCellStyle: React.CSSProperties = {
  fontWeight: '500',
  color: '#ececf1',
}

const typeStyle: React.CSSProperties = {
  backgroundColor: '#404040',
  color: '#ececf1',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '0.8rem',
  fontWeight: '500',
}

const contentContainerStyle: React.CSSProperties = {
  maxWidth: '1000px',
  maxHeight: '120px',
  overflow: 'auto',
  border: '1px solid #404040',
  borderRadius: '4px',
  padding: '8px',
  backgroundColor: '#1a1a1a',
}

const contentStyle: React.CSSProperties = {
  color: '#b0b0b0',
  lineHeight: '1.4',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
}

const linkStyle: React.CSSProperties = {
  color: '#4a9eff',
  textDecoration: 'none',
  wordBreak: 'break-all',
}

const linkStyleHover: React.CSSProperties = {
  textDecoration: 'underline',
}

const dateStyle: React.CSSProperties = {
  color: '#8e8ea0',
  fontSize: '0.8rem',
}

const actionButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.2rem',
  padding: '4px',
  borderRadius: '4px',
  transition: 'background-color 0.2s',
}

const emptyStateStyle: React.CSSProperties = {
  padding: '40px 20px',
  textAlign: 'center',
  color: '#8e8ea0',
}

const paginationStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '20px',
  padding: '20px',
  backgroundColor: '#2a2a2a',
  borderRadius: '8px',
  border: '1px solid #404040',
}

const paginationInfoStyle: React.CSSProperties = {
  color: '#8e8ea0',
  fontSize: '0.9rem',
}

const paginationControlsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}

const paginationButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  border: '1px solid #404040',
  borderRadius: '4px',
  backgroundColor: '#1a1a1a',
  color: '#ececf1',
  cursor: 'pointer',
  fontSize: '0.9rem',
  transition: 'all 0.2s',
}

const pageInfoStyle: React.CSSProperties = {
  padding: '8px 12px',
  backgroundColor: '#404040',
  color: '#ececf1',
  borderRadius: '4px',
  fontSize: '0.9rem',
  fontWeight: '500',
  minWidth: '40px',
  textAlign: 'center',
}

export default DataPage
