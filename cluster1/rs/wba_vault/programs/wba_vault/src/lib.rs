use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_spl::{token::{TokenAccount, Token, Mint, Transfer as SplTransfer}, associated_token::AssociatedToken};

declare_id!("53SX2j4x8UaKM7fdy8C1UWUwhmMbKVBpsHRQVKLvHcwP");

#[program]
pub mod wba_vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {

        ctx.accounts.vault_state.score = 0;
        ctx.accounts.vault_state.vault_bump = *ctx.bumps.get("vault_auth").unwrap();
        ctx.accounts.vault_state.auth_bump = *ctx.bumps.get("vault").unwrap();
        ctx.accounts.vault_state.owner = *ctx.accounts.owner.key;


      /*   let vault_state = &mut ctx.accounts.vault_state;
        vault_state.score = 0; */
        
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> ProgramResult {
      /*   let txn = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.owner.key(),
            &ctx.accounts.vault_state.key(),
            amount
        );
        anchor_lang::solana_program::program::invoke(
            &txn,
            &[
                ctx.accounts.owner.to_account_info(),
                ctx.accounts.vault_state.to_account_info()
            ],  
        )?;

        Ok(()) */

        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_accounts = anchor_lang::system_program::Transfer {
            from: ctx.accounts.owner.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
        };
        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

        anchor_lang::system_program::transfer(cpi_context, amount)?;
        
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> ProgramResult {
        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_accounts = anchor_lang::system_program::Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.owner.to_account_info(),
        };
        let seeds = &[
            "vault".as_bytes(),
            &ctx.accounts.vault_auth.key().clone().to_bytes(),
            &[ctx.accounts.vault_state.vault_bump]
        ];
        let signer_seeds = &[&seeds[..]];
        let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        anchor_lang::system_program::transfer(cpi_context, amount)?;
        
        Ok(())
    }

    pub fn depositspl(ctx: Context<DepositSpl>, amount: u64) -> ProgramResult {
        //cpi context
        let cpi = CpiContext::new(ctx.accounts.token_program.to_account_info(),SplTransfer{
            from : ctx.accounts.owner_ata.to_account_info(),
            authority : ctx.accounts.owner.to_account_info(),
            to : ctx.accounts.vault_ata.to_account_info(),
            });
            anchor_spl::token::transfer(cpi, amount)?;
            

        Ok(())
    }

    
    pub fn withdrawspl(ctx: Context<WithdrawSpl>, amount: u64) -> Result<()> {
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let seeds = &[
            "auth".as_bytes(),
            &ctx.accounts.vault_state.key().clone().to_bytes(),
            &[ctx.accounts.vault_state.vault_bump]
        ];
        let signer_seeds = &[&seeds[..]];
        let cpi_accounts = anchor_spl::token::Transfer {
            from: ctx.accounts.vault_ata.to_account_info(),
            authority: ctx.accounts.vault_auth.to_account_info(),
            to: ctx.accounts.owner_ata.to_account_info(),
            
        };
        let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        anchor_spl::token::transfer(cpi_context, amount)?;
        
        Ok(())
    }   
    pub fn close_account(_ctx: Context<CloseAccount>) -> Result <()>
    {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize <'info>
{
    #[account(mut)]
    pub owner : Signer <'info>,
    #[account(init, payer=owner, space=Vault::LEN)]
    pub vault_state : Account <'info, Vault>,
    #[account(seeds = [b"auth", vault_state.key().as_ref()], bump)]
    /// CHECK
    pub vault_auth: UncheckedAccount<'info>,
    #[account(mut, seeds = [b"vault", vault_auth.key().as_ref()], bump)]
    pub vault : SystemAccount <'info>,
    pub system_program: Program <'info, System>
}
#[account]
pub struct Vault
{
    owner: Pubkey,
    auth_bump: u8,
    vault_bump: u8,
    score: u8,

}
impl Vault {
    const LEN:usize = 50 ;

}

#[derive(Accounts)]
pub struct Deposit<'info>{
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut, has_one = owner)]
    pub vault_state : Account <'info, Vault>,
    #[account(seeds = [b"auth", vault_state.key().as_ref()], bump)]
    /// CHECK: Don't need to check this
    pub vault_auth: UncheckedAccount<'info>,
    #[account(mut, seeds = [b"vault", vault_auth.key().as_ref()], bump)]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct Withdraw<'info>{
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut, has_one = owner)]
    pub vault_state : Account <'info, Vault>,
    #[account(seeds = [b"auth", vault_state.key().as_ref()], bump)]
    /// CHECK: Don't need to check this
    pub vault_auth: UncheckedAccount<'info>,
    #[account(mut, seeds = [b"vault", vault_auth.key().as_ref()], bump)]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,

}

#[derive(Accounts)]
pub struct DepositSpl <'info>
{   
    #[account(mut)]
    pub owner : Signer <'info>,    
    #[account(mut, associated_token::mint = token_mint, associated_token::authority = owner)]
    pub owner_ata : Account <'info, TokenAccount>,
    #[account(mut, has_one = owner)]
    pub vault_state : Account <'info, Vault>,
    #[account(seeds = [b"auth", vault_state.key().as_ref()], bump=vault_state.vault_bump)]
    /// CHECK
    pub vault_auth: UncheckedAccount<'info>,
    #[account(init_if_needed, payer = owner, associated_token::mint = token_mint, associated_token::authority = vault_auth)]
    pub vault_ata : Account <'info, TokenAccount>,
    pub token_mint : Account <'info, Mint >,
    pub token_program : Program <'info, Token>,
    pub associated_token_program :  Program  <'info, AssociatedToken>,
    pub system_program : Program <'info, System>
}

#[derive(Accounts)]
pub struct WithdrawSpl<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub owner_ata: Account<'info, TokenAccount>,
    #[account(mut, has_one = owner)]
    pub vault_state: Account<'info, Vault>,
    #[account(seeds = [b"auth", vault_state.key().as_ref()], bump=vault_state.vault_bump)]
    /// CHECK
    pub vault_auth: UncheckedAccount<'info>,
    #[account(mut)]
    pub vault_ata: Account<'info, TokenAccount>,
    /// CHECK
    pub token_mint: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
  
}


 #[derive(Accounts)]
 pub struct CloseAccount <'info>
 {
     #[account(mut)]
     pub owner: Signer<'info>,
     #[account(mut, has_one = owner, close =owner)]
     pub vault_state: Account <'info, Vault>,
     pub system_program : Program<'info, System>
 }