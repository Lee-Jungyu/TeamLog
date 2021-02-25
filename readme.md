maven 설치

mariadb 설치

mariadb에서 teamlog db 생성 
```
create user 'your_name'@'localhost' identified by 'your_password'
create database teamlog
grant all privileges on teamlog.* to 'your_name'@'localhost';
use teamlog
```

user table 생성 
```
create table user(
	id varchar(20) not null,
	name varchar(20) not null,
	password varchar(20) not null,
	regDate timestamp default now(),
	primary key(id)
);
```

root-context 계정정보 변경

<property name="username" value="your_name" />

<property name="password" value="your_password" />