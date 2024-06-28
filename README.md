# nodedjangointegration

Copie os dados referentes ao env

    cp env-sample .env

Configure a sua aplicação django. 

Neste exemplo pegamos um settings default de uma aplicação `Django`, que gerado para este projeto.

O único pre-requisito para execução é que já exista uma aplicação django e que esta possua usuários, no meu caso para esta prova de conceito eu apenas criei um superusuário utilizando o comando `python manage.py createsuperuser`

No caso o que pode ser feito é utilizar o `pyscripts/settings.py` de um projeto real.

Pronto agora é só utilizar a sua aplicação nodejs utilizando o django para validar os dados de credenciais de usuário.