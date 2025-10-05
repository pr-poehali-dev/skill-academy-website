import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

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

const newPatientsPool: Omit<Patient, 'id' | 'status'>[] = [
  {
    fullName: 'Кузнецова Ольга Викторовна',
    passport: '4822 901234',
    age: 29,
    isChild: false,
    phone: '+7 (926) 123-45-67',
    complaints: 'Боль в горле, температура 37.8°C, слабость',
    doctor: 'Павлова Анна Сергеевна',
    specialty: 'ЛОР',
    date: '2024-10-08',
    time: '16:30'
  },
  {
    fullName: 'Николаев Виктор Андреевич',
    passport: '4623 112233',
    age: 58,
    isChild: false,
    phone: '+7 (903) 234-56-78',
    complaints: 'Повышенное давление 160/95, головокружение',
    doctor: 'Козлова Елена Дмитриевна',
    specialty: 'Кардиолог',
    date: '2024-10-08',
    time: '17:00'
  },
  {
    fullName: 'Белова Татьяна Игоревна (представитель ребенка)',
    passport: '4724 334455',
    age: 5,
    isChild: true,
    phone: '+7 (915) 345-67-89',
    complaints: 'У ребёнка (Белов Максим, 5 лет) сыпь на теле, зуд, покраснения',
    doctor: 'Лебедева Мария Сергеевна',
    specialty: 'Дерматолог',
    date: '2024-10-08',
    time: '17:30'
  },
  {
    fullName: 'Семёнов Павел Дмитриевич',
    passport: '4525 556677',
    age: 41,
    isChild: false,
    phone: '+7 (918) 456-78-90',
    complaints: 'Острая боль в пояснице, отдаёт в ногу',
    doctor: 'Волков Сергей Петрович',
    specialty: 'Ортопед',
    date: '2024-10-08',
    time: '18:00'
  },
  {
    fullName: 'Григорьева Светлана Павловна',
    passport: '4826 778899',
    age: 36,
    isChild: false,
    phone: '+7 (922) 567-89-01',
    complaints: 'Боль в животе, тошнота, нарушение пищеварения',
    doctor: 'Смирнов Андрей Викторович',
    specialty: 'Терапевт',
    date: '2024-10-08',
    time: '18:30'
  }
];

const Index = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Patient | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [nextPatientIndex, setNextPatientIndex] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (nextPatientIndex < newPatientsPool.length) {
        const newPatient = newPatientsPool[nextPatientIndex];
        const newId = Math.max(...appointments.map(a => a.id), 0) + 1;
        
        const patientWithId: Patient = {
          ...newPatient,
          id: newId,
          status: 'pending'
        };

        setAppointments(prev => [patientWithId, ...prev]);
        setNextPatientIndex(prev => prev + 1);

        toast.success('Новая заявка!', {
          description: `${newPatient.fullName} записан к ${newPatient.specialty}`,
          icon: <Icon name="Bell" className="w-5 h-5" />
        });
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [nextPatientIndex, appointments]);

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
      pending: { label: 'Новая', variant: 'default' as const, color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
      accepted: { label: 'Принята', variant: 'secondary' as const, color: 'bg-gradient-to-r from-green-500 to-green-600' },
      'in-progress': { label: 'На приёме', variant: 'default' as const, color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
      completed: { label: 'Завершена', variant: 'outline' as const, color: 'bg-gradient-to-r from-gray-500 to-gray-600' },
      rejected: { label: 'Отклонена', variant: 'destructive' as const, color: 'bg-gradient-to-r from-red-500 to-red-600' }
    };
    const config = statusConfig[status];
    return <Badge className={`${config.color} text-white border-0`}>{config.label}</Badge>;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-xl border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Icon name="Heart" className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  МедЦентр Плюс
                </h1>
                <p className="text-sm text-gray-500">Система управления записями</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-blue-50">
                    <Avatar className="w-9 h-9 ring-2 ring-blue-500">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                        ДМ
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-gray-900">Директор</p>
                      <p className="text-xs text-gray-500">Михайлов Д.А.</p>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Профиль директора</DialogTitle>
                    <DialogDescription>
                      Общая информация и статистика работы
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6 p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                      <Avatar className="w-24 h-24 ring-4 ring-white/50">
                        <AvatarFallback className="bg-white/20 text-white text-3xl font-bold">
                          ДМ
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold">Дмитрий Анатольевич Михайлов</h3>
                        <p className="text-blue-100 text-lg">Директор медицинского центра</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span className="flex items-center">
                            <Icon name="Briefcase" className="w-4 h-4 mr-1" />
                            Стаж: 15 лет
                          </span>
                          <span className="flex items-center">
                            <Icon name="Award" className="w-4 h-4 mr-1" />
                            Врач высшей категории
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="border-blue-200 bg-blue-50">
                        <CardHeader className="pb-3">
                          <CardDescription className="text-blue-600">Сегодня принято</CardDescription>
                          <CardTitle className="text-3xl text-blue-700">{stats.accepted + stats.inProgress}</CardTitle>
                        </CardHeader>
                      </Card>
                      <Card className="border-green-200 bg-green-50">
                        <CardHeader className="pb-3">
                          <CardDescription className="text-green-600">Завершено</CardDescription>
                          <CardTitle className="text-3xl text-green-700">{stats.completed}</CardTitle>
                        </CardHeader>
                      </Card>
                      <Card className="border-yellow-200 bg-yellow-50">
                        <CardHeader className="pb-3">
                          <CardDescription className="text-yellow-600">В очереди</CardDescription>
                          <CardTitle className="text-3xl text-yellow-700">{stats.pending}</CardTitle>
                        </CardHeader>
                      </Card>
                      <Card className="border-purple-200 bg-purple-50">
                        <CardHeader className="pb-3">
                          <CardDescription className="text-purple-600">Всего записей</CardDescription>
                          <CardTitle className="text-3xl text-purple-700">{stats.total}</CardTitle>
                        </CardHeader>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Icon name="TrendingUp" className="w-5 h-5 mr-2 text-blue-600" />
                          Эффективность работы
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Обработано заявок</span>
                            <span className="font-semibold">{Math.round((stats.accepted + stats.completed) / stats.total * 100)}%</span>
                          </div>
                          <Progress value={(stats.accepted + stats.completed) / stats.total * 100} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Завершённые приёмы</span>
                            <span className="font-semibold">{Math.round(stats.completed / stats.total * 100)}%</span>
                          </div>
                          <Progress value={stats.completed / stats.total * 100} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Icon name="Users" className="w-5 h-5 mr-2 text-purple-600" />
                          Контактная информация
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-600">Email</Label>
                          <p className="font-medium">d.mikhailov@medcenter.ru</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Телефон</Label>
                          <p className="font-medium">+7 (495) 123-45-67</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Внутренний номер</Label>
                          <p className="font-medium">101</p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Кабинет</Label>
                          <p className="font-medium">Административный корпус, 3 этаж</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Панель управления
          </h2>
          <p className="text-gray-600">Управление записями пациентов на приём</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-3">
              <CardDescription>Всего записей</CardDescription>
              <CardTitle className="text-4xl bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                {stats.total}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-600">
                <Icon name="Calendar" className="w-4 h-4 mr-1" />
                Сегодня
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 animate-fade-in">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-700">Новые заявки</CardDescription>
              <CardTitle className="text-4xl text-blue-600">{stats.pending}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-blue-600">
                <Icon name="Clock" className="w-4 h-4 mr-1 animate-pulse" />
                Ожидают
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-700">Принято</CardDescription>
              <CardTitle className="text-4xl text-green-600">{stats.accepted}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-600">
                <Icon name="CheckCircle" className="w-4 h-4 mr-1" />
                Подтверждено
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-yellow-50 to-orange-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-orange-700">На приёме</CardDescription>
              <CardTitle className="text-4xl text-orange-600">{stats.inProgress}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-orange-600">
                <Icon name="Activity" className="w-4 h-4 mr-1" />
                В процессе
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-700">Завершено</CardDescription>
              <CardTitle className="text-4xl text-purple-600">{stats.completed}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-purple-600">
                <Icon name="CheckCheck" className="w-4 h-4 mr-1" />
                Выполнено
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center">
              <Icon name="Search" className="w-5 h-5 mr-2 text-blue-600" />
              Фильтры и поиск
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Icon name="Search" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Поиск по ФИО, врачу или специальности..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full md:w-auto">
                <TabsList className="bg-gray-100">
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
          {filteredAppointments.map((appointment, index) => (
            <Card 
              key={appointment.id} 
              className="border-0 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in bg-white"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl text-gray-900">{appointment.fullName}</CardTitle>
                      {appointment.isChild && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                          <Icon name="Baby" className="w-3 h-3 mr-1" />
                          Ребёнок
                        </Badge>
                      )}
                      {getStatusBadge(appointment.status)}
                    </div>
                    <CardDescription className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="flex items-center text-gray-600">
                        <Icon name="User" className="w-4 h-4 mr-1 text-blue-500" />
                        {appointment.doctor}
                      </span>
                      <span className="flex items-center text-gray-600">
                        <Icon name="Stethoscope" className="w-4 h-4 mr-1 text-purple-500" />
                        {appointment.specialty}
                      </span>
                      <span className="flex items-center text-gray-600">
                        <Icon name="Calendar" className="w-4 h-4 mr-1 text-green-500" />
                        {new Date(appointment.date).toLocaleDateString('ru-RU')} в {appointment.time}
                      </span>
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedAppointment(appointment)}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <Icon name="Eye" className="w-4 h-4 mr-2" />
                        Подробнее
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                          <Icon name="FileText" className="w-6 h-6 text-blue-600" />
                          Карточка записи #{appointment.id}
                          {getStatusBadge(appointment.status)}
                        </DialogTitle>
                        <DialogDescription>
                          Полная информация о записи пациента
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center text-gray-900 text-lg">
                            <Icon name="User" className="w-5 h-5 mr-2 text-blue-600" />
                            Данные пациента
                          </h3>
                          <div className="grid grid-cols-2 gap-4 bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                            <div>
                              <Label className="text-gray-600">ФИО</Label>
                              <p className="font-medium text-gray-900">{appointment.fullName}</p>
                            </div>
                            <div>
                              <Label className="text-gray-600">Паспорт</Label>
                              <p className="font-medium text-gray-900">{appointment.passport}</p>
                            </div>
                            <div>
                              <Label className="text-gray-600">Возраст</Label>
                              <p className="font-medium text-gray-900">{appointment.age} {appointment.isChild ? 'лет' : 'года'}</p>
                            </div>
                            <div>
                              <Label className="text-gray-600">Телефон</Label>
                              <p className="font-medium text-gray-900">{appointment.phone}</p>
                            </div>
                            <div className="col-span-2">
                              <Label className="text-gray-600">Категория</Label>
                              <p className="font-medium text-gray-900">
                                {appointment.isChild ? '👶 Детский приём' : '👤 Взрослый приём'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="font-semibold mb-3 flex items-center text-gray-900 text-lg">
                            <Icon name="Stethoscope" className="w-5 h-5 mr-2 text-purple-600" />
                            Информация о приёме
                          </h3>
                          <div className="grid grid-cols-2 gap-4 bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                            <div>
                              <Label className="text-gray-600">Врач</Label>
                              <p className="font-medium text-gray-900">{appointment.doctor}</p>
                            </div>
                            <div>
                              <Label className="text-gray-600">Специальность</Label>
                              <p className="font-medium text-gray-900">{appointment.specialty}</p>
                            </div>
                            <div>
                              <Label className="text-gray-600">Дата</Label>
                              <p className="font-medium text-gray-900">{new Date(appointment.date).toLocaleDateString('ru-RU')}</p>
                            </div>
                            <div>
                              <Label className="text-gray-600">Время</Label>
                              <p className="font-medium text-gray-900">{appointment.time}</p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="font-semibold mb-3 flex items-center text-gray-900 text-lg">
                            <Icon name="FileText" className="w-5 h-5 mr-2 text-yellow-600" />
                            Жалобы пациента
                          </h3>
                          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 p-4 rounded-xl">
                            <p className="text-gray-900 leading-relaxed">{appointment.complaints}</p>
                          </div>
                        </div>

                        {appointment.diagnosis && (
                          <>
                            <Separator />
                            <div>
                              <h3 className="font-semibold mb-3 flex items-center text-gray-900 text-lg">
                                <Icon name="Clipboard" className="w-5 h-5 mr-2 text-blue-600" />
                                Диагноз
                              </h3>
                              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-4 rounded-xl">
                                <p className="text-gray-900 leading-relaxed">{appointment.diagnosis}</p>
                              </div>
                            </div>
                          </>
                        )}

                        {appointment.recommendations && (
                          <>
                            <Separator />
                            <div>
                              <h3 className="font-semibold mb-3 flex items-center text-gray-900 text-lg">
                                <Icon name="Pill" className="w-5 h-5 mr-2 text-green-600" />
                                Рекомендации
                              </h3>
                              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-4 rounded-xl">
                                <p className="text-gray-900 leading-relaxed">{appointment.recommendations}</p>
                              </div>
                            </div>
                          </>
                        )}

                        <Separator />

                        <div className="flex gap-2">
                          {appointment.status === 'pending' && (
                            <>
                              <Button
                                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
                                onClick={() => updateAppointmentStatus(appointment.id, 'accepted')}
                              >
                                <Icon name="CheckCircle" className="w-4 h-4 mr-2" />
                                Принять заявку
                              </Button>
                              <Button
                                variant="destructive"
                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
                                onClick={() => updateAppointmentStatus(appointment.id, 'rejected')}
                              >
                                <Icon name="XCircle" className="w-4 h-4 mr-2" />
                                Отклонить
                              </Button>
                            </>
                          )}
                          {appointment.status === 'accepted' && (
                            <Button
                              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg"
                              onClick={() => updateAppointmentStatus(appointment.id, 'in-progress')}
                            >
                              <Icon name="Activity" className="w-4 h-4 mr-2" />
                              Начать приём
                            </Button>
                          )}
                          {appointment.status === 'in-progress' && (
                            <Button
                              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 shadow-lg"
                              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                            >
                              <Icon name="CheckCheck" className="w-4 h-4 mr-2" />
                              Завершить приём
                            </Button>
                          )}
                          {appointment.status === 'completed' && (
                            <div className="flex-1 text-center bg-gradient-to-r from-green-50 to-green-100 text-green-700 font-semibold py-3 rounded-lg border-2 border-green-300">
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
              <CardContent className="pt-4">
                <div className="flex items-start space-x-2 text-sm bg-gray-50 p-3 rounded-lg">
                  <Icon name="MessageSquare" className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 line-clamp-2">{appointment.complaints}</p>
                </div>
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-gray-50 to-blue-50/30 border-t">
                <div className="flex items-center justify-between w-full text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Icon name="IdCard" className="w-4 h-4 mr-1 text-purple-500" />
                      {appointment.passport}
                    </span>
                    <span className="flex items-center">
                      <Icon name="Phone" className="w-4 h-4 mr-1 text-green-500" />
                      {appointment.phone}
                    </span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <Card className="text-center py-16 border-0 shadow-lg bg-gradient-to-br from-gray-50 to-blue-50">
            <CardContent>
              <Icon name="FileSearch" className="w-20 h-20 mx-auto text-blue-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Записи не найдены</h3>
              <p className="text-gray-600">Попробуйте изменить фильтры или поисковый запрос</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
