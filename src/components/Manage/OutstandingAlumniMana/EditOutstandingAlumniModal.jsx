import React, { useState, useEffect } from 'react';
import { Award, X, Check } from 'lucide-react';
import AppModal from 'components/common/AppModal';
import { Button, Field, ModalSection, ModalGrid } from 'components/common/ui';
import Axios from 'common/Axios';

const EditOutstandingAlumniModal = ({ show, onClose, data, onSubmit }) => {
    const [alumniData, setAlumniData] = useState({
        highlight: '',
        achievements: '',
        is_featured: false,
        sort_order: 0,
    });

    useEffect(() => {
        if (data) {
            setAlumniData({
                ...data,
                sort_order: data.sort_order ?? 0,
            });
        }
    }, [data]);

    const handleChange = (field, value) => {
        setAlumniData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!alumniData.highlight) {
            alert("請填寫摘要");
            return;
        }
        onSubmit(alumniData);
    };

    return (
        <AppModal
            show={show}
            onHide={onClose}
            title="編輯傑出校友資料"
            icon={<Award size={20} />}
            size="lg"
            variant="admin"
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>
                        <X size={16} /> 取消
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={!alumniData.highlight}
                    >
                        <Check size={16} /> 儲存
                    </Button>
                </>
            }
        >
            <ModalSection title="基本資訊" icon={<Award size={18} />}>
                <Field
                    as="input"
                    type="text"
                    label="摘要"
                    required
                    placeholder="輸入摘要"
                    value={alumniData.highlight}
                    onChange={(e) => handleChange('highlight', e.target.value)}
                />
                <Field
                    as="textarea"
                    label="詳細成就"
                    rows={4}
                    placeholder="輸入詳細成就"
                    value={alumniData.achievements}
                    onChange={(e) => handleChange('achievements', e.target.value)}
                />
            </ModalSection>

            <ModalSection title="顯示設定">
                <ModalGrid cols={2}>
                    <Field
                        as="input"
                        type="number"
                        label="顯示順序"
                        min="0"
                        placeholder="輸入顯示順序（數字越小越前面）"
                        value={alumniData.sort_order}
                        onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
                        help="順序數字越小，在列表中顯示越前面"
                    />
                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="checkbox"
                                className="toggle toggle-primary"
                                checked={alumniData.is_featured}
                                onChange={(e) => handleChange('is_featured', e.target.checked)}
                            />
                            <span className="label-text font-medium">展示於官網</span>
                        </label>
                    </div>
                </ModalGrid>
            </ModalSection>
        </AppModal>
    );
};

export default EditOutstandingAlumniModal;
