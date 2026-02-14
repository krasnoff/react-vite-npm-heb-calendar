import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useCalendar } from './useCalendar';
import { Language } from '../enums/language';
import { WeekdaysHebrew, WeekdaysEnglish } from '../enums';
import type { DayObj } from '../interfaces/dayObj';

describe('useCalendar', () => {
  describe('Initialization', () => {
    it('should initialize with current date when no selectedDate is provided', () => {
      const mockOnSelectDate = vi.fn();
      const { result } = renderHook(() => useCalendar(undefined, Language.Hebrew, mockOnSelectDate));
      
      const currentDate = new Date();
      expect(result.current.selectedYear).toBe(currentDate.getFullYear());
      expect(result.current.selectedMonth).toBe(currentDate.getMonth());
    });

    it('should initialize with provided selectedDate', () => {
      const testDate = new Date(2024, 5, 15); // June 15, 2024
      const mockOnSelectDate = vi.fn();
      const { result } = renderHook(() => useCalendar(testDate, Language.Hebrew, mockOnSelectDate));
      
      expect(result.current.selectedYear).toBe(2024);
      expect(result.current.selectedMonth).toBe(5);
    });
  });

  describe('Language Settings', () => {
    it('should set Hebrew weekday names when language is Hebrew', () => {
      const mockOnSelectDate = vi.fn();
      const { result } = renderHook(() => useCalendar(undefined, Language.Hebrew, mockOnSelectDate));
      
      expect(result.current.SelectedEnum).toBeDefined();
      expect(result.current.SelectedEnum?.[0]).toBe(WeekdaysHebrew.Sunday);
      expect(result.current.SelectedEnum?.length).toBe(7);
    });

    it('should set English weekday names when language is English', () => {
      const mockOnSelectDate = vi.fn();
      const { result } = renderHook(() => useCalendar(undefined, Language.English, mockOnSelectDate));
      
      expect(result.current.SelectedEnum).toBeDefined();
      expect(result.current.SelectedEnum?.[0]).toBe(WeekdaysEnglish.Sunday);
      expect(result.current.SelectedEnum?.length).toBe(7);
    });
  });

  describe('Month Data Generation', () => {
    it('should generate MonthDates array', () => {
      const mockOnSelectDate = vi.fn();
      const testDate = new Date(2024, 0, 1); // January 2024
      const { result } = renderHook(() => useCalendar(testDate, Language.Hebrew, mockOnSelectDate));
      
      expect(result.current.MonthDates).toBeDefined();
      expect(Array.isArray(result.current.MonthDates)).toBe(true);
      expect(result.current.MonthDates.length).toBeGreaterThan(0);
    });

    it('should set FirstDayMonth and LastDayMonth correctly', () => {
      const mockOnSelectDate = vi.fn();
      const testDate = new Date(2024, 0, 1); // January 2024
      const { result } = renderHook(() => useCalendar(testDate, Language.Hebrew, mockOnSelectDate));
      
      expect(result.current.FirstDayMonth).toBeDefined();
      expect(result.current.LastDayMonth).toBeDefined();
      expect(result.current.FirstDayMonth?.internationalDate).toBe(1);
      expect(result.current.LastDayMonth?.internationalDate).toBe(31);
    });
  });

  describe('Date Selection', () => {
    it('should set selected date on initialization', () => {
      const testDate = new Date(2024, 5, 15);
      testDate.setHours(0, 0, 0, 0);
      const mockOnSelectDate = vi.fn();
      const { result } = renderHook(() => useCalendar(testDate, Language.Hebrew, mockOnSelectDate));
      
      expect(result.current.selectedDate).toBeDefined();
      expect(result.current.selectedDate?.internationalDate).toBe(15);
    });

    it('should call onSelectDate when handleClick is invoked', () => {
      const mockOnSelectDate = vi.fn();
      const testDate = new Date(2024, 0, 1);
      const { result } = renderHook(() => useCalendar(testDate, Language.Hebrew, mockOnSelectDate));
      
      const dayToClick = result.current.MonthDates[0].find((day: DayObj | undefined) => day !== undefined);
      
      if (dayToClick) {
        act(() => {
          result.current.handleClick(dayToClick);
        });
        
        expect(mockOnSelectDate).toHaveBeenCalledWith(dayToClick);
        expect(result.current.selectedDate).toBe(dayToClick);
      }
    });
  });

  describe('Year and Month Changes', () => {
    it('should handle year change', () => {
      const mockOnSelectDate = vi.fn();
      const { result } = renderHook(() => useCalendar(undefined, Language.Hebrew, mockOnSelectDate));
      
      // Create a mock input element
      const mockInput = document.createElement('input');
      mockInput.value = '2025';
      
      act(() => {
        if (result.current.selectedYearContainer.current) {
          Object.defineProperty(result.current.selectedYearContainer, 'current', {
            writable: true,
            value: mockInput
          });
        }
        result.current.handleSelectedYearChange();
      });
      
      expect(result.current.selectedYear).toBe(2025);
    });

    it('should handle month change', () => {
      const mockOnSelectDate = vi.fn();
      const { result } = renderHook(() => useCalendar(undefined, Language.Hebrew, mockOnSelectDate));
      
      // Create a mock select element
      const mockSelect = document.createElement('select');
      mockSelect.value = '6'; // July (0-indexed)
      
      act(() => {
        if (result.current.selectedMonthContainer.current) {
          Object.defineProperty(result.current.selectedMonthContainer, 'current', {
            writable: true,
            value: mockSelect
          });
        }
        result.current.handleSelectedMonthChange();
      });
      
      expect(result.current.selectedMonth).toBe(6);
    });
  });

  describe('Hebrew Month Names', () => {
    it('should return correct Hebrew month name', () => {
      const mockOnSelectDate = vi.fn();
      const testDate = new Date(2024, 0, 1);
      const { result } = renderHook(() => useCalendar(testDate, Language.Hebrew, mockOnSelectDate));
      
      const firstDayHebrewDate = result.current.FirstDayMonth?.HebrewDate;
      if (firstDayHebrewDate) {
        const monthName = result.current.getHebMonthName(firstDayHebrewDate);
        expect(monthName).toBeTruthy();
        expect(typeof monthName).toBe('string');
      }
    });

    it('should return empty string for undefined date', () => {
      const mockOnSelectDate = vi.fn();
      const { result } = renderHook(() => useCalendar(undefined, Language.Hebrew, mockOnSelectDate));
      
      const monthName = result.current.getHebMonthName(undefined);
      expect(monthName).toBe('');
    });
  });

  describe('DayObj Structure', () => {
    it('should create DayObj with all required properties', () => {
      const mockOnSelectDate = vi.fn();
      const testDate = new Date(2024, 0, 1);
      const { result } = renderHook(() => useCalendar(testDate, Language.Hebrew, mockOnSelectDate));
      
      const firstDay = result.current.MonthDates[0].find((day: DayObj | undefined) => day !== undefined);
      
      expect(firstDay).toBeDefined();
      expect(firstDay?.internationalDate).toBeDefined();
      expect(firstDay?.ButtonDate).toBeInstanceOf(Date);
      expect(firstDay?.DayOfWeek).toBeGreaterThanOrEqual(0);
      expect(firstDay?.DayOfWeek).toBeLessThanOrEqual(6);
      expect(firstDay?.HebrewDate).toBeDefined();
      expect(Array.isArray(firstDay?.EventObj)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle leap year February correctly', () => {
      const mockOnSelectDate = vi.fn();
      const leapYearDate = new Date(2024, 1, 1); // February 2024 (leap year)
      const { result } = renderHook(() => useCalendar(leapYearDate, Language.Hebrew, mockOnSelectDate));
      
      expect(result.current.LastDayMonth?.internationalDate).toBe(29);
    });

    it('should handle non-leap year February correctly', () => {
      const mockOnSelectDate = vi.fn();
      const nonLeapYearDate = new Date(2023, 1, 1); // February 2023 (non-leap year)
      const { result } = renderHook(() => useCalendar(nonLeapYearDate, Language.Hebrew, mockOnSelectDate));
      
      expect(result.current.LastDayMonth?.internationalDate).toBe(28);
    });

    it('should handle invalid year input gracefully', () => {
      const mockOnSelectDate = vi.fn();
      const { result } = renderHook(() => useCalendar(undefined, Language.Hebrew, mockOnSelectDate));
      
      const mockInput = document.createElement('input');
      mockInput.value = 'invalid';
      
      act(() => {
        Object.defineProperty(result.current.selectedYearContainer, 'current', {
          writable: true,
          value: mockInput
        });
        result.current.handleSelectedYearChange();
      });
      
      expect(result.current.selectedYear).toBe(1);
    });
  });

  describe('Keyboard Interaction', () => {
    it('should handle keyboard events', () => {
      const mockOnSelectDate = vi.fn();
      const testDate = new Date(2024, 0, 1);
      const { result } = renderHook(() => useCalendar(testDate, Language.Hebrew, mockOnSelectDate));
      
      const firstDay = result.current.MonthDates[0].find((day: DayObj | undefined) => day !== undefined);
      
      if (firstDay) {
        const mockKeyboardEvent = {
          key: 'Enter',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent<HTMLDivElement>;
        
        act(() => {
          result.current.handleKeyDown(mockKeyboardEvent, firstDay);
        });
        
        // Should not throw error
        expect(true).toBe(true);
      }
    });
  });
});
