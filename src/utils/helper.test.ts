import { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import {
  capitalize,
  getDailyDurationInMinutesPanel,
  getDurationInDaysPanel,
  getValidReturnTo,
  isInvalidToken,
  splitUsername,
} from './helper';

const axiosErrorWithStatus = (status: number) =>
  new AxiosError('error', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
  } as AxiosResponse);

describe('getDurationInDaysPanel', () => {
  it('форматирует количество дней', () => {
    expect(getDurationInDaysPanel(30)).toBe('30 дней');
  });

  it('работает с нулём и единицей', () => {
    expect(getDurationInDaysPanel(0)).toBe('0 дней');
    expect(getDurationInDaysPanel(1)).toBe('1 дней');
  });
});

describe('getDailyDurationInMinutesPanel', () => {
  it('форматирует диапазон минут', () => {
    expect(getDailyDurationInMinutesPanel(15, 30)).toBe('15-30 мин/день');
  });

  it('работает с нулём в начале диапазона', () => {
    expect(getDailyDurationInMinutesPanel(0, 5)).toBe('0-5 мин/день');
  });
});

describe('capitalize', () => {
  it('делает первую букву заглавной', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('приводит остальные буквы к нижнему регистру', () => {
    expect(capitalize('HELLO')).toBe('Hello');
    expect(capitalize('hELLO wORLD')).toBe('Hello world');
  });

  it('возвращает пустую строку без изменений', () => {
    expect(capitalize('')).toBe('');
  });

  it('работает с одним символом', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('не меняет строку, начинающуюся с цифры', () => {
    expect(capitalize('123abc')).toBe('123abc');
  });
});

describe('splitUsername', () => {
  it('берёт часть email до @ и капитализирует', () => {
    expect(splitUsername('ivan@sky.pro')).toBe('Ivan');
    expect(splitUsername('john.doe@example.com')).toBe('John.doe');
  });

  it('капитализирует строку без @ целиком', () => {
    expect(splitUsername('noatsign')).toBe('Noatsign');
  });

  it('возвращает исходную строку, если часть до @ пуста', () => {
    expect(splitUsername('@domain.com')).toBe('@domain.com');
  });

  it('возвращает пустую строку без изменений', () => {
    expect(splitUsername('')).toBe('');
  });
});

describe('getValidReturnTo', () => {
  it('пропускает /main', () => {
    expect(getValidReturnTo('/main')).toBe('/main');
  });

  it('пропускает путь к курсу', () => {
    expect(getValidReturnTo('/main/course/abc123')).toBe('/main/course/abc123');
  });

  it('отклоняет путь к курсу без id и с лишними сегментами', () => {
    expect(getValidReturnTo('/main/course/')).toBeUndefined();
    expect(getValidReturnTo('/main/course/a/b')).toBeUndefined();
  });

  it('отклоняет другие пути и внешние URL', () => {
    expect(getValidReturnTo('/main/other')).toBeUndefined();
    expect(getValidReturnTo('/evil')).toBeUndefined();
    expect(getValidReturnTo('https://evil.com')).toBeUndefined();
    expect(getValidReturnTo('//evil.com')).toBeUndefined();
    expect(getValidReturnTo('/main?x=1')).toBeUndefined();
  });

  it('отклоняет массив, undefined и пустую строку', () => {
    expect(getValidReturnTo(['/main'])).toBeUndefined();
    expect(getValidReturnTo(undefined)).toBeUndefined();
    expect(getValidReturnTo('')).toBeUndefined();
  });
});

describe('isInvalidToken', () => {
  it('true для AxiosError со статусом 401', () => {
    expect(isInvalidToken(axiosErrorWithStatus(401))).toBe(true);
  });

  it('false для других статусов', () => {
    expect(isInvalidToken(axiosErrorWithStatus(403))).toBe(false);
    expect(isInvalidToken(axiosErrorWithStatus(500))).toBe(false);
  });

  it('false для AxiosError без ответа (сетевая ошибка)', () => {
    expect(isInvalidToken(new AxiosError('Network Error'))).toBe(false);
  });

  it('false для не-AxiosError объектов с похожей формой', () => {
    expect(isInvalidToken({ response: { status: 401 } })).toBe(false);
    expect(isInvalidToken(new Error('Unauthorized'))).toBe(false);
  });

  it('false для null, undefined и примитивов', () => {
    expect(isInvalidToken(null)).toBe(false);
    expect(isInvalidToken(undefined)).toBe(false);
    expect(isInvalidToken('401')).toBe(false);
  });
});
