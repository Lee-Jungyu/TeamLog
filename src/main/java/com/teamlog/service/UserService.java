package com.teamlog.service;

import java.util.List;

import com.teamlog.domain.UserVO;

public interface UserService {
	public List<UserVO> list() throws Exception;
}
