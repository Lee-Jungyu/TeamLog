package com.teamlog.dao;

import java.util.List;

import com.teamlog.domain.UserVO;

public interface UserDAO {
	public List<UserVO> list() throws Exception;
}
