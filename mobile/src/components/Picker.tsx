import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Typography, FontSize } from '../theme/typography';
import { Spacing, BorderRadius, Layout } from '../theme/spacing';

interface PickerOption {
  label: string;
  value: string;
}

interface PickerProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: PickerOption[];
  onValueChange: (value: string) => void;
  error?: string;
}

export const Picker: React.FC<PickerProps> = ({
  label,
  placeholder = 'Select an option',
  value,
  options,
  onValueChange,
  error,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption?.label || placeholder;

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={[
          styles.trigger,
          error && styles.triggerError,
          value && styles.triggerSelected,
        ]}
      >
        <Text
          style={[
            styles.triggerText,
            !value && styles.triggerTextPlaceholder,
          ]}
        >
          {displayText}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{label || 'Select'}</Text>
                  <TouchableOpacity onPress={() => setIsVisible(false)}>
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={options}
                  keyExtractor={item => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.option,
                        item.value === value && styles.optionSelected,
                      ]}
                      onPress={() => handleSelect(item.value)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          item.value === value && styles.optionTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                      {item.value === value && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.bodyBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Layout.inputHeight,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  triggerError: {
    borderColor: Colors.error,
    borderWidth: 2,
  },
  triggerSelected: {
    borderColor: Colors.primary,
  },
  triggerText: {
    ...Typography.body,
    color: Colors.text,
  },
  triggerTextPlaceholder: {
    color: Colors.textLight,
  },
  arrow: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    ...Typography.h4,
    color: Colors.text,
  },
  closeButton: {
    fontSize: 24,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.sm,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  optionSelected: {
    backgroundColor: Colors.primaryLight + '20',
  },
  optionText: {
    ...Typography.body,
    color: Colors.text,
  },
  optionTextSelected: {
    ...Typography.bodyBold,
    color: Colors.primary,
  },
  checkmark: {
    fontSize: 18,
    color: Colors.primary,
  },
});
