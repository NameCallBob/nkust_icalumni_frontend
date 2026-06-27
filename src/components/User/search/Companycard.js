// CompanyCard.jsx
import React from 'react';
import { BsBuilding, BsPerson, BsBriefcase, BsGeo, BsArrowRight } from "react-icons/bs";
import { handleImageError, getImageSrc } from '../../../utils/imageDefaults';

const CompanyCard = ({ company, onClick }) => {
  return (
    <div
      className="company-card"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
      }}
    >
      {/* Company Image - 16:9 ratio */}
      <div style={{ position: 'relative', paddingTop: '56.25%', background: '#f8fafc', flexShrink: 0 }}>
        <img
          src={getImageSrc(company.photo, 'company')}
          alt={company.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            backgroundColor: '#f8fafc',
          }}
          onError={(e) => handleImageError(e, 'company')}
        />
        {company.industry_title && (
          <span
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              padding: '3px 8px',
              background: '#eff6ff',
              color: '#1e3a8a',
              border: '1px solid #bfdbfe',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: '500',
            }}
          >
            {company.industry_title}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Company Name */}
        <h5
          style={{
            margin: '0 0 8px',
            fontWeight: '600',
            color: '#0f172a',
            fontSize: '1.05rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <BsBuilding style={{ color: '#1e3a8a', flexShrink: 0 }} />
          {company.name}
        </h5>

        {/* Address */}
        {company.address && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '8px',
              fontSize: '0.8rem',
              color: '#94a3b8',
            }}
          >
            <BsGeo style={{ flexShrink: 0 }} />
            <span>{company.address}</span>
          </div>
        )}

        {/* Description */}
        <p
          style={{
            margin: '0 0 12px',
            fontSize: '0.875rem',
            color: '#475569',
            lineHeight: '1.5',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            flex: 1,
          }}
        >
          {company.description || company.products || '暫無公司描述'}
        </p>

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid #e2e8f0',
            paddingTop: '12px',
            marginTop: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.875rem',
              color: '#475569',
              marginBottom: company.position ? '4px' : '0',
            }}
          >
            <BsPerson style={{ flexShrink: 0 }} />
            <span>系友：{company.member_name}</span>
          </div>
          {company.position && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.875rem',
                color: '#475569',
                marginBottom: '8px',
              }}
            >
              <BsBriefcase style={{ flexShrink: 0 }} />
              <span>職位：{company.position}</span>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.875rem',
              color: '#2563eb',
              fontWeight: '500',
              marginTop: '8px',
            }}
          >
            了解更多
            <BsArrowRight style={{ flexShrink: 0 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
