import json
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Решение математических задач с помощью OpenAI
    Args: event - dict с httpMethod, body (содержит question)
          context - объект с request_id
    Returns: HTTP response с решением задачи
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    question: str = body_data.get('question', '')
    
    if not question:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Вопрос не может быть пустым'}),
            'isBase64Encoded': False
        }
    
    api_key = os.environ.get('OPENAI_API_KEY')
    
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'API ключ OpenAI не настроен',
                'answer': 'Чтобы ИИ-помощник заработал, добавьте API ключ OpenAI в настройках проекта.'
            }),
            'isBase64Encoded': False
        }
    
    try:
        from openai import OpenAI
        
        client = OpenAI(api_key=api_key)
        
        response = client.chat.completions.create(
            model='gpt-4o-mini',
            messages=[
                {
                    'role': 'system',
                    'content': '''Ты - математический помощник для школьников. 
Твоя задача - решать математические задачи и объяснять решение понятным языком.

Правила:
1. Давай ПОШАГОВОЕ решение
2. Объясняй каждый шаг простым языком
3. Используй примеры, если нужно
4. В конце дай ОТВЕТ
5. Пиши на русском языке
6. Будь дружелюбным и понятным

Пример ответа:
"Решим уравнение 2x + 5 = 13

Шаг 1: Перенесём 5 в правую часть
2x = 13 - 5
2x = 8

Шаг 2: Разделим обе части на 2
x = 8 ÷ 2
x = 4

Ответ: x = 4

Проверка: 2·4 + 5 = 8 + 5 = 13 ✓"'''
                },
                {
                    'role': 'user',
                    'content': question
                }
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        answer = response.choices[0].message.content
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'answer': answer}, ensure_ascii=False),
            'isBase64Encoded': False
        }
        
    except ImportError:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Библиотека OpenAI не установлена',
                'answer': 'Требуется установка пакета openai'
            }),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': f'Ошибка при обращении к OpenAI: {str(e)}',
                'answer': 'Произошла ошибка при решении задачи. Попробуйте ещё раз.'
            }),
            'isBase64Encoded': False
        }
