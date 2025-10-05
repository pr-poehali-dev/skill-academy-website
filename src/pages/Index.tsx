import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

type AppointmentStatus = 'pending' | 'accepted' | 'in-progress' | 'completed' | 'rejected';

interface Patient {
  id: number;
  fullName: string;
  passport: string;
  age: number;
  isChild: boolean;
  phone: string;
  complaints: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  diagnosis?: string;
  recommendations?: string;
}

const Index = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Patient[]>([
    {
      id: 1,
      fullName: 'Иванова Мария Петровна',
      passport: '4512 789456',
      age: 34,
      isChild: false,
      phone: '+7 (912) 345-67-89',
      complaints: 'Головные боли, повышенная утомляемость, бессонница в течение последних 2 недель',
      doctor: 'Смирнов Андрей Викторович',
      specialty: 'Терапевт',
      date: '2024-10-08',
      time: '09:00',
      status: 'pending'
    },
    {
      id: 2,
      fullName: 'Петров Александр Сергеевич',
      passport: '4615 234567',
      age: 45,
      isChild: false,
      phone: '+7 (921) 456-78-90',
      complaints: 'Боли в области сердца, одышка при физической нагрузке',
      doctor: 'Козлова Елена Дмитриевна',
      specialty: 'Кардиолог',
      date: '2024-10-08',
      time: '10:30',
      status: 'accepted'
    },
    {
      id: 3,
      fullName: 'Соколова Анна Ивановна (представитель ребенка)',
      passport: '4718 345678',
      age: 7,
      isChild: true,
      phone: '+7 (905) 567-89-01',
      complaints: 'У ребёнка (Соколов Дмитрий, 7 лет) температура 38.5°C, кашель, насморк',
      doctor: 'Новикова Ольга Александровна',
      specialty: 'Педиатр',
      date: '2024-10-08',
      time: '11:00',
      status: 'in-progress'
    },
    {
      id: 4,
      fullName: 'Морозов Дмитрий Николаевич',
      passport: '4519 456789',
      age: 52,
      isChild: false,
      phone: '+7 (913) 678-90-12',
      complaints: 'Боли в коленном суставе, ограничение подвижности',
      doctor: 'Волков Сергей Петрович',
      specialty: 'Ортопед',
      date: '2024-10-08',
      time: '14:00',
      status: 'pending'
    },
    {
      id: 5,
      fullName: 'Васильева Екатерина Андреевна',
      passport: '4620 567890',
      age: 28,
      isChild: false,
      phone: '+7 (908) 789-01-23',
      complaints: 'Аллергическая реакция, сыпь на коже, зуд',
      doctor: 'Лебедева Мария Сергеевна',
      specialty: 'Дерматолог',
      date: '2024-10-08',
      time: '15:30',
      status: 'pending'
    },
    {
      id: 6,
      fullName: 'Сидоров Игорь Владимирович',
      passport: '4721 678901',
      age: 39,
      isChild: false,
      phone: '+7 (917) 890-12-34',
      complaints: 'Острая зубная боль в области нижней челюсти слева',
      doctor: 'Федоров Алексей Иванович',
      specialty: 'Стоматолог',
      date: '2024-10-07',
      time: '16:00',
      status: 'completed',
      diagnosis: 'Кариес, пульпит 36 зуба',
      recommendations: 'Проведено эндодонтическое лечение. Повторный приём через 2 недели для установки пломбы.'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const updateAppointmentStatus = (id: number, newStatus: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt)
    );
    if (selectedAppointment?.id === id) {
      setSelectedAppointment(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    const statusConfig = {
      pending: { label: 'Новая', variant: 'default' as const, color: 'bg-blue-500' },
      accepted: { label: 'Принята', variant: 'secondary' as const, color: 'bg-green-500' },
      'in-progress': { label: 'На приёме', variant: 'default' as const, color: 'bg-yellow-500' },
      completed: { label: 'Завершена', variant: 'outline' as const, color: 'bg-gray-500' },
      rejected: { label: 'Отклонена', variant: 'destructive' as const, color: 'bg-red-500' }
    };
    const config = statusConfig[status];
    return <Badge variant={config.variant} className={`${config.color} text-white`}>{config.label}</Badge>;
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    accepted: appointments.filter(a => a.status === 'accepted').length,
    inProgress: appointments.filter(a => a.status === 'in-progress').length,
    completed: appointments.filter(a => a.status === 'completed').length
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesSearch = apt.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Heart" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">МедЦентр Плюс</h1>
                <p className="text-sm text-gray-500">Система управления записями</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                <Icon name="UserCog" className="w-4 h-4 mr-1" />
                Директор
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Панель управления</h2>
          <p className="text-gray-600">Управление записями пациентов на приём</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Всего записей</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-600">
                <Icon name="Calendar" className="w-4 h-4 mr-1" />
                Сегодня
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Новые заявки</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{stats.pending}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-blue-600">
                <Icon name="Clock" className="w-4 h-4 mr-1" />
                Ожидают
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Принято</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.accepted}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-600">
                <Icon name="CheckCircle" className="w-4 h-4 mr-1" />
                Подтверждено
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>На приёме</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">{stats.inProgress}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-yellow-600">
                <Icon name="Activity" className="w-4 h-4 mr-1" />
                В процессе
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Завершено</CardDescription>
              <CardTitle className="text-3xl text-gray-600">{stats.completed}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-600">
                <Icon name="CheckCheck" className="w-4 h-4 mr-1" />
                Выполнено
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Фильтры и поиск</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Поиск по ФИО, врачу или специальности..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="all">Все</TabsTrigger>
                  <TabsTrigger value="pending">Новые</TabsTrigger>
                  <TabsTrigger value="accepted">Принятые</TabsTrigger>
                  <TabsTrigger value="in-progress">На приёме</TabsTrigger>
                  <TabsTrigger value="completed">Завершённые</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{appointment.fullName}</CardTitle>
                      {appointment.isChild && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          <Icon name="Baby" className="w-3 h-3 mr-1" />
                          Ребёнок
                        </Badge>
                      )}
                      {getStatusBadge(appointment.status)}
                    </div>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center">
                        <Icon name="User" className="w-4 h-4 mr-1" />
                        {appointment.doctor}
                      </span>
                      <span className="flex items-center">
                        <Icon name="Stethoscope" className="w-4 h-4 mr-1" />
                        {appointment.specialty}
                      </span>
                      <span className="flex items-center">
                        <Icon name="Calendar" className="w-4 h-4 mr-1" />
                        {new Date(appointment.date).toLocaleDateString('ru-RU')} в {appointment.time}
                      </span>
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedAppointment(appointment)}>
                        Подробнее
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          Карточка записи #{appointment.id}
                          {getStatusBadge(appointment.status)}
                        </DialogTitle>
                        <DialogDescription>
                          Полная информация о записи пациента
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center text-gray-900">
                            <Icon name="User" className="w-5 h-5 mr-2 text-primary" />
                            Данные пациента
                          </h3>
                          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                            <div>
                              <Label className="text-gray-600">ФИО</Label>
                              <p className="font-medium">{appointment.fullName}</p>
                            </div>
                            <div>
                              <Label className="text-gray-600">Паспорт</Label>
                              <p className="font-medium">{appointment.passport}</p>
                            </div>
                            <div>
                              <Label className="text-gray-600">Возраст</Label>
                              <p className="font-medium">{appointment.age} {appointment.isChild ? 'лет' : 'года'}</p>
                            </div>
                            <div>
                              <Label className="text-gray-600">Телефон</Label>
                              <p className="font-medium">{appointment.phone}</p>
                            </div>
                            <div className="col-span-2">
                              <Label className="text-gray-600">Категория</Label>
                              <p className="font-medium">
                                {appointment.isChild ? '👶 Детский приём' : '👤 Взрослый приём'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="font-semibold mb-3 flex items-center text-gray-900">
                            <Icon name="Stethoscope" className="w-5 h-5 mr-2 text-primary" />
                            Информация о приёме
                          </h3>
                          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                            <div>
                              <Label className="text-gray-600">Врач</Label>
                              <p className="font-medium">{appointment.doctor}</p>
                            </div>
                            <div>
                              <Label className="text-gray-600">Специальность</Label>
                              <p className="font-medium">{appointment.specialty}</p>
                            </div>
                            <div>
                              <Label className="text-gray-600">Дата</Label>
                              <p className="font-medium">{new Date(appointment.date).toLocaleDateString('ru-RU')}</p>
                            </div>
                            <div>
                              <Label className="text-gray-600">Время</Label>
                              <p className="font-medium">{appointment.time}</p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="font-semibold mb-3 flex items-center text-gray-900">
                            <Icon name="FileText" className="w-5 h-5 mr-2 text-primary" />
                            Жалобы пациента
                          </h3>
                          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                            <p className="text-gray-900">{appointment.complaints}</p>
                          </div>
                        </div>

                        {appointment.diagnosis && (
                          <>
                            <Separator />
                            <div>
                              <h3 className="font-semibold mb-3 flex items-center text-gray-900">
                                <Icon name="Clipboard" className="w-5 h-5 mr-2 text-primary" />
                                Диагноз
                              </h3>
                              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                <p className="text-gray-900">{appointment.diagnosis}</p>
                              </div>
                            </div>
                          </>
                        )}

                        {appointment.recommendations && (
                          <>
                            <Separator />
                            <div>
                              <h3 className="font-semibold mb-3 flex items-center text-gray-900">
                                <Icon name="Pill" className="w-5 h-5 mr-2 text-primary" />
                                Рекомендации
                              </h3>
                              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                <p className="text-gray-900">{appointment.recommendations}</p>
                              </div>
                            </div>
                          </>
                        )}

                        <Separator />

                        <div className="flex gap-2">
                          {appointment.status === 'pending' && (
                            <>
                              <Button
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={() => updateAppointmentStatus(appointment.id, 'accepted')}
                              >
                                <Icon name="CheckCircle" className="w-4 h-4 mr-2" />
                                Принять заявку
                              </Button>
                              <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={() => updateAppointmentStatus(appointment.id, 'rejected')}
                              >
                                <Icon name="XCircle" className="w-4 h-4 mr-2" />
                                Отклонить
                              </Button>
                            </>
                          )}
                          {appointment.status === 'accepted' && (
                            <Button
                              className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                              onClick={() => updateAppointmentStatus(appointment.id, 'in-progress')}
                            >
                              <Icon name="Activity" className="w-4 h-4 mr-2" />
                              Начать приём
                            </Button>
                          )}
                          {appointment.status === 'in-progress' && (
                            <Button
                              className="flex-1 bg-gray-600 hover:bg-gray-700"
                              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                            >
                              <Icon name="CheckCheck" className="w-4 h-4 mr-2" />
                              Завершить приём
                            </Button>
                          )}
                          {appointment.status === 'completed' && (
                            <div className="flex-1 text-center text-green-600 font-medium py-2">
                              <Icon name="CheckCheck" className="w-5 h-5 inline mr-2" />
                              Приём завершён
                            </div>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-2 text-sm">
                  <Icon name="MessageSquare" className="w-4 h-4 text-gray-400 mt-0.5" />
                  <p className="text-gray-600 line-clamp-2">{appointment.complaints}</p>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <div className="flex items-center justify-between w-full text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Icon name="IdCard" className="w-4 h-4 mr-1" />
                      {appointment.passport}
                    </span>
                    <span className="flex items-center">
                      <Icon name="Phone" className="w-4 h-4 mr-1" />
                      {appointment.phone}
                    </span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Icon name="FileSearch" className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Записи не найдены</h3>
              <p className="text-gray-600">Попробуйте изменить фильтры или поисковый запрос</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
