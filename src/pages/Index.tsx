import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface HistoryItem {
  id: number;
  type: 'calculation' | 'ai-help';
  question: string;
  answer: string;
  timestamp: Date;
}

const Index = () => {
  const [display, setDisplay] = useState('0');
  const [currentOperation, setCurrentOperation] = useState('');
  const [previousValue, setPreviousValue] = useState('');
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  
  const [fraction1Num, setFraction1Num] = useState('');
  const [fraction1Den, setFraction1Den] = useState('');
  const [fraction2Num, setFraction2Num] = useState('');
  const [fraction2Den, setFraction2Den] = useState('');
  const [fractionOperation, setFractionOperation] = useState('+');
  const [fractionResult, setFractionResult] = useState('');

  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState('calculator');

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const handleNumber = (num: string) => {
    if (shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    if (previousValue && currentOperation && !shouldResetDisplay) {
      calculateResult();
    }
    setPreviousValue(display);
    setCurrentOperation(op);
    setShouldResetDisplay(true);
  };

  const calculateResult = () => {
    if (!previousValue || !currentOperation) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(display);
    let result = 0;

    switch (currentOperation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        result = current !== 0 ? prev / current : 0;
        break;
      case '^':
        result = Math.pow(prev, current);
        break;
      case '%':
        result = (prev * current) / 100;
        break;
    }

    const expression = `${previousValue} ${currentOperation} ${display} = ${result}`;
    addToHistory('calculation', expression, result.toString());
    
    setDisplay(result.toString());
    setPreviousValue('');
    setCurrentOperation('');
    setShouldResetDisplay(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue('');
    setCurrentOperation('');
    setShouldResetDisplay(false);
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleSquareRoot = () => {
    const value = parseFloat(display);
    const result = Math.sqrt(value);
    addToHistory('calculation', `√${display}`, result.toString());
    setDisplay(result.toString());
    setShouldResetDisplay(true);
  };

  const handleSquare = () => {
    const value = parseFloat(display);
    const result = value * value;
    addToHistory('calculation', `${display}²`, result.toString());
    setDisplay(result.toString());
    setShouldResetDisplay(true);
  };

  const calculateFraction = () => {
    const n1 = parseInt(fraction1Num) || 0;
    const d1 = parseInt(fraction1Den) || 1;
    const n2 = parseInt(fraction2Num) || 0;
    const d2 = parseInt(fraction2Den) || 1;

    if (d1 === 0 || d2 === 0) {
      toast.error('Знаменатель не может быть равен 0');
      return;
    }

    let resultNum = 0;
    let resultDen = 1;

    switch (fractionOperation) {
      case '+':
        resultNum = n1 * d2 + n2 * d1;
        resultDen = d1 * d2;
        break;
      case '-':
        resultNum = n1 * d2 - n2 * d1;
        resultDen = d1 * d2;
        break;
      case '×':
        resultNum = n1 * n2;
        resultDen = d1 * d2;
        break;
      case '÷':
        resultNum = n1 * d2;
        resultDen = d1 * n2;
        break;
    }

    const divisor = gcd(Math.abs(resultNum), Math.abs(resultDen));
    resultNum = resultNum / divisor;
    resultDen = resultDen / divisor;

    const expression = `${n1}/${d1} ${fractionOperation} ${n2}/${d2}`;
    const answer = resultDen === 1 ? `${resultNum}` : `${resultNum}/${resultDen}`;
    
    setFractionResult(answer);
    addToHistory('calculation', expression, answer);
    toast.success('Дробь вычислена!');
  };

  const addToHistory = (type: 'calculation' | 'ai-help', question: string, answer: string) => {
    const newItem: HistoryItem = {
      id: Date.now(),
      type,
      question,
      answer,
      timestamp: new Date()
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
  };

  const handleAiHelp = async () => {
    if (!aiQuestion.trim()) {
      toast.error('Введите задачу!');
      return;
    }

    setAiLoading(true);
    setAiAnswer('');

    try {
      const response = await fetch('https://functions.poehali.dev/b97d0395-0857-4912-b36d-60e4f6536861', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: aiQuestion })
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.error && data.error.includes('API ключ')) {
          toast.error('Добавьте API ключ OpenAI в настройках');
          setAiAnswer(data.answer || 'Для работы ИИ-помощника нужно добавить API ключ OpenAI в настройках проекта.');
        } else {
          throw new Error(data.error || 'Ошибка запроса');
        }
      } else {
        setAiAnswer(data.answer);
        addToHistory('ai-help', aiQuestion, data.answer);
        toast.success('Задача решена!');
      }
    } catch (error) {
      toast.error('Ошибка подключения к ИИ');
      setAiAnswer('Произошла ошибка. Убедитесь, что API ключ OpenAI настроен правильно.');
    } finally {
      setAiLoading(false);
    }
  };

  const calculatorButtons = [
    { label: 'C', onClick: handleClear, className: 'bg-red-500 hover:bg-red-600 text-white' },
    { label: '√', onClick: handleSquareRoot, className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    { label: 'x²', onClick: handleSquare, className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    { label: '÷', onClick: () => handleOperator('÷'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    { label: '7', onClick: () => handleNumber('7'), className: 'bg-gray-700 hover:bg-gray-600 text-white' },
    { label: '8', onClick: () => handleNumber('8'), className: 'bg-gray-700 hover:bg-gray-600 text-white' },
    { label: '9', onClick: () => handleNumber('9'), className: 'bg-gray-700 hover:bg-gray-600 text-white' },
    { label: '×', onClick: () => handleOperator('×'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    { label: '4', onClick: () => handleNumber('4'), className: 'bg-gray-700 hover:bg-gray-600 text-white' },
    { label: '5', onClick: () => handleNumber('5'), className: 'bg-gray-700 hover:bg-gray-600 text-white' },
    { label: '6', onClick: () => handleNumber('6'), className: 'bg-gray-700 hover:bg-gray-600 text-white' },
    { label: '-', onClick: () => handleOperator('-'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    { label: '1', onClick: () => handleNumber('1'), className: 'bg-gray-700 hover:bg-gray-600 text-white' },
    { label: '2', onClick: () => handleNumber('2'), className: 'bg-gray-700 hover:bg-gray-600 text-white' },
    { label: '3', onClick: () => handleNumber('3'), className: 'bg-gray-700 hover:bg-gray-600 text-white' },
    { label: '+', onClick: () => handleOperator('+'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    { label: '0', onClick: () => handleNumber('0'), className: 'bg-gray-700 hover:bg-gray-600 text-white col-span-2' },
    { label: '.', onClick: handleDecimal, className: 'bg-gray-700 hover:bg-gray-600 text-white' },
    { label: '=', onClick: calculateResult, className: 'bg-green-500 hover:bg-green-600 text-white' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <header className="bg-white shadow-md border-b-4 border-indigo-500">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Icon name="Calculator" className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  МатПомощник
                </h1>
                <p className="text-sm text-gray-500">Умный калькулятор для школьников</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
              <Icon name="Sparkles" className="w-3 h-3 mr-1" />
              С ИИ-помощником
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="calculator">
              <Icon name="Calculator" className="w-4 h-4 mr-2" />
              Калькулятор
            </TabsTrigger>
            <TabsTrigger value="fractions">
              <Icon name="Divide" className="w-4 h-4 mr-2" />
              Дроби
            </TabsTrigger>
            <TabsTrigger value="ai-helper">
              <Icon name="Brain" className="w-4 h-4 mr-2" />
              ИИ-помощник
            </TabsTrigger>
            <TabsTrigger value="history">
              <Icon name="History" className="w-4 h-4 mr-2" />
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <Card className="max-w-md mx-auto shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Calculator" className="w-5 h-5 mr-2 text-indigo-600" />
                  Обычный калькулятор
                </CardTitle>
                <CardDescription>Базовые операции с десятичными числами</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-900 p-6 rounded-lg">
                  <div className="text-right">
                    {previousValue && currentOperation && (
                      <div className="text-gray-400 text-sm mb-1">
                        {previousValue} {currentOperation}
                      </div>
                    )}
                    <div className="text-white text-4xl font-mono break-all">
                      {display}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {calculatorButtons.map((btn, idx) => (
                    <Button
                      key={idx}
                      onClick={btn.onClick}
                      className={`h-16 text-xl font-semibold ${btn.className}`}
                    >
                      {btn.label}
                    </Button>
                  ))}
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm text-indigo-900 mb-2 flex items-center">
                    <Icon name="Info" className="w-4 h-4 mr-1" />
                    Дополнительные операции:
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleOperator('^')}
                      className="bg-white"
                    >
                      <Icon name="Superscript" className="w-4 h-4 mr-2" />
                      Степень (^)
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleOperator('%')}
                      className="bg-white"
                    >
                      <Icon name="Percent" className="w-4 h-4 mr-2" />
                      Процент (%)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fractions" className="space-y-6">
            <Card className="max-w-2xl mx-auto shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Divide" className="w-5 h-5 mr-2 text-purple-600" />
                  Калькулятор дробей
                </CardTitle>
                <CardDescription>Сложение, вычитание, умножение и деление дробей</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Первая дробь</label>
                    <div className="flex flex-col items-center space-y-1">
                      <Input
                        type="number"
                        placeholder="Числитель"
                        value={fraction1Num}
                        onChange={(e) => setFraction1Num(e.target.value)}
                        className="text-center text-lg"
                      />
                      <div className="w-full h-0.5 bg-gray-400"></div>
                      <Input
                        type="number"
                        placeholder="Знаменатель"
                        value={fraction1Den}
                        onChange={(e) => setFraction1Den(e.target.value)}
                        className="text-center text-lg"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <select
                      value={fractionOperation}
                      onChange={(e) => setFractionOperation(e.target.value)}
                      className="text-3xl font-bold bg-transparent border-2 border-purple-500 rounded-lg px-4 py-2 text-purple-700"
                    >
                      <option value="+">+</option>
                      <option value="-">−</option>
                      <option value="×">×</option>
                      <option value="÷">÷</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Вторая дробь</label>
                    <div className="flex flex-col items-center space-y-1">
                      <Input
                        type="number"
                        placeholder="Числитель"
                        value={fraction2Num}
                        onChange={(e) => setFraction2Num(e.target.value)}
                        className="text-center text-lg"
                      />
                      <div className="w-full h-0.5 bg-gray-400"></div>
                      <Input
                        type="number"
                        placeholder="Знаменатель"
                        value={fraction2Den}
                        onChange={(e) => setFraction2Den(e.target.value)}
                        className="text-center text-lg"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center text-3xl font-bold text-purple-700">
                    =
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Результат</label>
                    <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-6 rounded-lg border-2 border-purple-300">
                      <div className="text-3xl font-bold text-center text-purple-900">
                        {fractionResult || '?'}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={calculateFraction}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg h-12"
                >
                  <Icon name="Equal" className="w-5 h-5 mr-2" />
                  Вычислить дробь
                </Button>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm text-purple-900 mb-2 flex items-center">
                    <Icon name="Lightbulb" className="w-4 h-4 mr-1" />
                    Как пользоваться:
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>Введите числитель и знаменатель для каждой дроби</li>
                    <li>Выберите операцию (+, −, ×, ÷)</li>
                    <li>Нажмите "Вычислить" — результат автоматически сократится</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-helper" className="space-y-6">
            <Card className="max-w-3xl mx-auto shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Brain" className="w-5 h-5 mr-2 text-indigo-600" />
                  ИИ-помощник по математике
                </CardTitle>
                <CardDescription>
                  Вставьте задачу — ИИ решит и объяснит пошагово
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Ваша задача:</label>
                  <Textarea
                    placeholder="Например: Реши уравнение 2x + 5 = 13&#10;Или: Как перевести 0.75 в дробь?&#10;Или: Найди 30% от 200"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    className="min-h-32 text-base"
                  />
                </div>

                <Button
                  onClick={handleAiHelp}
                  disabled={aiLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg h-12"
                >
                  {aiLoading ? (
                    <>
                      <Icon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
                      Решаю задачу...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" className="w-5 h-5 mr-2" />
                      Решить задачу
                    </>
                  )}
                </Button>

                {aiAnswer && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                      <Icon name="CheckCircle" className="w-5 h-5 mr-2" />
                      Решение:
                    </h4>
                    <div className="text-gray-900 whitespace-pre-wrap">{aiAnswer}</div>
                  </div>
                )}

                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm text-indigo-900 mb-2 flex items-center">
                    <Icon name="Sparkles" className="w-4 h-4 mr-1" />
                    Что умеет ИИ-помощник:
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>Решать уравнения и неравенства</li>
                    <li>Объяснять, как работать с дробями и процентами</li>
                    <li>Помогать с геометрией и алгеброй</li>
                    <li>Давать пошаговые решения задач</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="max-w-3xl mx-auto shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Icon name="History" className="w-5 h-5 mr-2 text-gray-700" />
                      История решений
                    </CardTitle>
                    <CardDescription>Все ваши вычисления и вопросы к ИИ</CardDescription>
                  </div>
                  {history.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setHistory([]);
                        toast.success('История очищена');
                      }}
                    >
                      <Icon name="Trash2" className="w-4 h-4 mr-2" />
                      Очистить
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="FileText" className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">История пуста</h3>
                    <p className="text-gray-600">Начните решать задачи — они появятся здесь</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border-2 ${
                          item.type === 'ai-help'
                            ? 'bg-indigo-50 border-indigo-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge
                            variant="outline"
                            className={
                              item.type === 'ai-help'
                                ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                                : 'bg-gray-100 text-gray-700 border-gray-300'
                            }
                          >
                            <Icon
                              name={item.type === 'ai-help' ? 'Brain' : 'Calculator'}
                              className="w-3 h-3 mr-1"
                            />
                            {item.type === 'ai-help' ? 'ИИ-помощник' : 'Калькулятор'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {item.timestamp.toLocaleTimeString('ru-RU')}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium text-gray-900">{item.question}</div>
                          <Separator />
                          <div className="text-sm text-gray-700 whitespace-pre-wrap">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;