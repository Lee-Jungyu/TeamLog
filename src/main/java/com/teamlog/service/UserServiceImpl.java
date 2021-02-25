package com.teamlog.service;

import java.util.List;

import javax.inject.Inject;

import org.springframework.stereotype.Service;

import com.teamlog.dao.UserDAO;
import com.teamlog.domain.UserVO;

@Service
public class UserServiceImpl implements UserService {
	
	@Inject
	private UserDAO dao;
	
	@Override
	public List<UserVO> list() throws Exception {
		// TODO Auto-generated method stub
		return dao.list();
	}

}
