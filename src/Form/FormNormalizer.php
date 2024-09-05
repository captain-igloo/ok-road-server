<?php

declare(strict_types=1);

namespace App\Form;

use Symfony\Component\Form\FormInterface;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

final class FormNormalizer
{
    public function __construct(private CsrfTokenManagerInterface $csrfTokenManager)
    {
    }

    public function normalize(FormInterface $form, string $tokenId): array
    {
        $normalized = [
            'fields' => [],
            'token' => $this->csrfTokenManager->getToken($tokenId)->getValue(),
        ];

        if (count($form->getErrors()) > 0) {
            $normalized['errors'] = [];
            foreach ($form->getErrors() as $e) {
                $normalized['errors'][] = $e->getMessage();
            }
        }
        
        foreach ($form as $k => $v) {
            $normalized['fields'][$k] = [
                'value' => $v->getData(),
            ];
            if (count($v->getErrors()) > 0) {
                $errors = [];
                foreach ($v->getErrors() as $e) {
                    $errors[] = $e->getMessage();
                }
                $normalized['fields'][$k]['errors'] = $errors;
            }
        }

        return $normalized;
    }
}
