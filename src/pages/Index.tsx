import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ name: '', email: '' });
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const courses = [
    {
      id: 1,
      title: 'Frontend Development',
      description: 'Освойте современную веб-разработку с React, TypeScript и Next.js',
      price: '49 990 ₽',
      duration: '6 месяцев',
      level: 'Средний',
      icon: 'Code2',
      gradient: 'from-blue-600 to-purple-600'
    },
    {
      id: 2,
      title: 'Backend Development',
      description: 'Создавайте масштабируемые серверные приложения на Node.js и Python',
      price: '54 990 ₽',
      duration: '7 месяцев',
      level: 'Продвинутый',
      icon: 'Database',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      id: 3,
      title: 'Full Stack Development',
      description: 'Полный курс веб-разработки от Frontend до Backend и DevOps',
      price: '89 990 ₽',
      duration: '12 месяцев',
      level: 'Все уровни',
      icon: 'Layers',
      gradient: 'from-orange-600 to-red-600'
    }
  ];

  const instructors = [
    {
      id: 1,
      name: 'Александр Петров',
      role: 'Senior Frontend Developer',
      company: 'Яндекс',
      experience: '8 лет',
      students: '2500+',
      avatar: 'AP',
      specialty: 'React & TypeScript'
    },
    {
      id: 2,
      name: 'Екатерина Смирнова',
      role: 'Lead Backend Engineer',
      company: 'VK',
      experience: '10 лет',
      students: '3200+',
      avatar: 'ЕС',
      specialty: 'Node.js & Python'
    },
    {
      id: 3,
      name: 'Дмитрий Иванов',
      role: 'Full Stack Architect',
      company: 'Ozon',
      experience: '12 лет',
      students: '4100+',
      avatar: 'ДИ',
      specialty: 'System Design'
    },
    {
      id: 4,
      name: 'Мария Козлова',
      role: 'DevOps Engineer',
      company: 'Avito',
      experience: '7 лет',
      students: '1800+',
      avatar: 'МК',
      specialty: 'CI/CD & Cloud'
    }
  ];

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setUser({
      name: formData.get('name') as string || 'Пользователь',
      email: formData.get('email') as string
    });
    setIsAuthenticated(true);
    setAuthDialogOpen(false);
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setUser({
      name: formData.get('name') as string,
      email: formData.get('email') as string
    });
    setIsAuthenticated(true);
    setAuthDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-tertiary">
      <nav className="border-b border-white/10 backdrop-blur-lg bg-dark-primary/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Code2" className="w-8 h-8 text-neon-blue" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-purple-500 bg-clip-text text-transparent">
                SKILL ACADEMY
              </h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#courses" className="text-white/80 hover:text-white transition-colors">Курсы</a>
              <a href="#instructors" className="text-white/80 hover:text-white transition-colors">Специалисты</a>
              <a href="#about" className="text-white/80 hover:text-white transition-colors">О нас</a>
            </div>

            {isAuthenticated ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-neon-blue to-purple-600">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-white">{user.name}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-dark-secondary border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-white">Мой профиль</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-20 h-20">
                        <AvatarFallback className="bg-gradient-to-br from-neon-blue to-purple-600 text-2xl">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold text-white">{user.name}</h3>
                        <p className="text-white/60">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid gap-4">
                      <Card className="bg-dark-tertiary border-white/10">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center space-x-2">
                            <Icon name="BookOpen" className="w-5 h-5 text-neon-blue" />
                            <span>Мои курсы</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-white/60">У вас пока нет активных курсов</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-dark-tertiary border-white/10">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center space-x-2">
                            <Icon name="Trophy" className="w-5 h-5 text-neon-orange" />
                            <span>Достижения</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-white/60">Начните обучение, чтобы получить первое достижение!</p>
                        </CardContent>
                      </Card>
                    </div>

                    <Button 
                      onClick={() => setIsAuthenticated(false)} 
                      variant="outline" 
                      className="w-full border-white/20 text-white hover:bg-white/10"
                    >
                      Выйти
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-neon-blue to-purple-600 hover:opacity-90 transition-opacity">
                    Войти
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-dark-secondary border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-white">Добро пожаловать в Skill Academy</DialogTitle>
                    <DialogDescription className="text-white/60">
                      Войдите или создайте аккаунт для доступа к курсам
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-dark-tertiary">
                      <TabsTrigger value="login">Вход</TabsTrigger>
                      <TabsTrigger value="register">Регистрация</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email" className="text-white">Email</Label>
                          <Input 
                            id="login-email" 
                            name="email" 
                            type="email" 
                            placeholder="your@email.com"
                            className="bg-dark-tertiary border-white/20 text-white placeholder:text-white/40"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password" className="text-white">Пароль</Label>
                          <Input 
                            id="login-password" 
                            name="password" 
                            type="password"
                            className="bg-dark-tertiary border-white/20 text-white"
                            required
                          />
                        </div>
                        <Input type="hidden" name="name" value="Пользователь" />
                        <Button type="submit" className="w-full bg-gradient-to-r from-neon-blue to-purple-600">
                          Войти
                        </Button>
                      </form>
                    </TabsContent>
                    <TabsContent value="register">
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="register-name" className="text-white">Имя</Label>
                          <Input 
                            id="register-name" 
                            name="name" 
                            type="text" 
                            placeholder="Ваше имя"
                            className="bg-dark-tertiary border-white/20 text-white placeholder:text-white/40"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-email" className="text-white">Email</Label>
                          <Input 
                            id="register-email" 
                            name="email" 
                            type="email" 
                            placeholder="your@email.com"
                            className="bg-dark-tertiary border-white/20 text-white placeholder:text-white/40"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-password" className="text-white">Пароль</Label>
                          <Input 
                            id="register-password" 
                            name="password" 
                            type="password"
                            className="bg-dark-tertiary border-white/20 text-white"
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full bg-gradient-to-r from-neon-blue to-purple-600">
                          Создать аккаунт
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </nav>

      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 via-purple-600/20 to-transparent blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">
              🚀 Новая эра в обучении программированию
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
                Освойте
              </span>
              <br />
              <span className="bg-gradient-to-r from-neon-blue to-purple-500 bg-clip-text text-transparent">
                программирование
              </span>
              <br />
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                с лучшими
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Станьте востребованным разработчиком за 6-12 месяцев. Практические проекты, менторская поддержка и гарантия трудоустройства.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-neon-blue to-purple-600 hover:opacity-90 text-lg px-8">
                Начать обучение
                <Icon name="ArrowRight" className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8">
                Смотреть программу
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="courses" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Наши курсы
            </h2>
            <p className="text-white/60 text-lg">Выберите направление и начните карьеру в IT</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {courses.map((course) => (
              <Card 
                key={course.id} 
                className="bg-dark-secondary/50 backdrop-blur border-white/10 hover:border-neon-blue/50 transition-all duration-300 hover:scale-105 group"
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${course.gradient} flex items-center justify-center mb-4 group-hover:animate-glow`}>
                    <Icon name={course.icon as any} className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">{course.title}</CardTitle>
                  <CardDescription className="text-white/60">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-white/60">
                      <Icon name="Clock" className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <Badge variant="outline" className="border-white/20 text-white">
                      {course.level}
                    </Badge>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-3xl font-bold text-white">{course.price}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-neon-blue to-purple-600 hover:opacity-90">
                    Записаться
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="instructors" className="py-20 bg-dark-tertiary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Наши специалисты
            </h2>
            <p className="text-white/60 text-lg">Учитесь у профессионалов из ведущих IT-компаний</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {instructors.map((instructor) => (
              <Card 
                key={instructor.id}
                className="bg-dark-secondary/50 backdrop-blur border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4 ring-2 ring-neon-blue/50">
                    <AvatarFallback className="bg-gradient-to-br from-neon-blue to-purple-600 text-2xl">
                      {instructor.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-white text-lg">{instructor.name}</CardTitle>
                  <CardDescription className="text-white/60">{instructor.role}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Компания</span>
                    <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">
                      {instructor.company}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Опыт</span>
                    <span className="text-white font-medium">{instructor.experience}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Студентов</span>
                    <span className="text-white font-medium">{instructor.students}</span>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-sm text-center text-white/80">
                      <Icon name="Code" className="w-4 h-4 inline mr-1" />
                      {instructor.specialty}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-dark-primary/80 backdrop-blur py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Code2" className="w-6 h-6 text-neon-blue" />
                <span className="font-bold text-white">SKILL ACADEMY</span>
              </div>
              <p className="text-white/60 text-sm">
                Лучшая платформа для обучения программированию с нуля до профессионала
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Курсы</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>Frontend Development</li>
                <li>Backend Development</li>
                <li>Full Stack</li>
                <li>DevOps</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>О нас</li>
                <li>Карьера</li>
                <li>Контакты</li>
                <li>Блог</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>FAQ</li>
                <li>Помощь</li>
                <li>Условия</li>
                <li>Конфиденциальность</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/40 text-sm">
            © 2024 Skill Academy. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
